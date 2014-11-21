/*******************************************************************************
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 ******************************************************************************/

touchslider2 = {
    output: function(/*string*/ msg) {
        if (console) {
            console.info(msg);
        }
    },
    
    /**
     * We start by creating the sliding grid out of the specified
     * element.  We'll look for each child with a class of cell when
     * we create the slide panel.
     */
    createSlidePanel: function(/*string*/ gridid, /*int*/ cellWidth, /*int*/ padding) {
        var x = padding;
        
        $(gridid).each(function() {
            $(this).css({
                'position': 'relative',
                'left': '0px'
            });
            
            $(this).parent().css('overflow', 'hidden');
            $(this).children('.cell').each(function() {
                $(this).css({
                    width: cellWidth + 'px',
                    height: '14%',
                    position: 'absolute',
                    left: x + 'px',
                    top: padding + 'px'
                });

                x += cellWidth + padding;
            });
            
            /*
               Many of the mobile browsers resize the screen and therefore
               don't give accurate information about the size of the window.
               We need to save this information so we can use it later when
               we're sliding the grid.
             */
            touchslider2.width = x;
            touchslider2.colWidth = cellWidth + padding;
            
            try {
                document.createEvent('TouchEvent');
                /*
                   Now that we've finished the layout we'll make our panel respond
                   to all of the touch events.
                 */
                touchslider2.makeTouchable(gridid);
            } catch (e) {
                /*
                 * Then we aren't on a device that supports touch
                 */
                $(this).css({
                    'height': '385px',
                    'overflow': 'auto'
                });
            }
        });
    },
    
    /**
     * This function just binds the touch functions for the grid.
     * It is very important to stop the default, stop the
     * propagation, and return false.  If we don't then the touch
     * events might cause the regular browser behavior for touches
     * and the screen will start sliding around.
     */
    makeTouchable: function(/*string*/ gridid) {
         $(gridid).each(function() {
            this.ontouchstart = function(e) {
                touchslider2.touchStart($(this), e);
                //e.preventDefault();
                //e.stopPropagation();
                return true;
            };
            
            this.ontouchend = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (touchslider2.sliding) {
                    touchslider2.sliding = false;
                    touchslider2.touchEnd($(this), e);
                    return false;
                } else {
                    /*
                       We never slid so we can just return true
                       and perform the default touch end
                     */
                    return true;
                }
            };
            
            this.ontouchmove = function(e) {
                touchslider2.touchMove($(this), e);
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
        });
    },
    
    /**
     * A little helper to parse off the 'px' at the end of the left
     * CSS attribute and parse it as a number.
     */
    getLeft: function(/*JQuery*/ elem) {
         return parseInt(elem.css('left').substring(0, elem.css('left').length - 2), 10);
    },
    
    /**
     * When the touch starts we add our sliding class a record a few
     * variables about where the touch started.  We also record the
     * start time so we can do momentum.
     */
    touchStart: function(/*JQuery*/ elem, /*event*/ e) {
         elem.css({
             '-webkit-transition-duration': '0'
         });
         
         touchslider2.startX = e.targetTouches[0].clientX;
         touchslider2.startLeft = touchslider2.getLeft(elem);
         touchslider2.touchStartTime = new Date().getTime();
         
    },
    
    /**
     * When the touch ends we need to adjust the grid for momentum
     * and to snap to the grid.  We also need to make sure they
     * didn't drag farther than the end of the list in either
     * direction.
     */
    touchEnd: function(/*JQuery*/ elem, /*event*/ e) {
         if (touchslider2.getLeft(elem) > 0) {
             /*
              * This means they dragged to the right past the first item
              */
             touchslider2.doSlide(elem, 0, '2s');
             
             elem.parent().removeClass('sliding');
             touchslider2.startX = null;
         } else if ((Math.abs(touchslider2.getLeft(elem)) + elem.parent().width()) > touchslider2.width) {
             /*
              * This means they dragged to the left past the last item
              */
             touchslider2.doSlide(elem, '-' + (touchslider2.width - elem.parent().width()), '2s');
             
             elem.parent().removeClass('sliding');
             touchslider2.startX = null;
         } else {
             /*
                This means they were just dragging within the bounds of the grid
                and we just need to handle the momentum and snap to the grid.
              */
             touchslider2.slideMomentum(elem, e);
         }
    },
    
    /**
     * If the user drags their finger really fast we want to push 
     * the slider a little farther since they were pushing a large 
     * amount. 
     */
    slideMomentum: function(/*jQuery*/ elem, /*event*/ e) {
         var slideAdjust = (new Date().getTime() - touchslider2.touchStartTime) * 10;
         var left = touchslider2.getLeft(elem);
         
         /*
            We calculate the momentum by taking the amount of time they were sliding
            and comparing it to the distance they slide.  If they slide a small distance
            quickly or a large distance slowly then they have almost no momentum.
            If they slide a long distance fast then they have a lot of momentum.
          */
         
         var changeX = 12000 * (Math.abs(touchslider2.startLeft) - Math.abs(left));
         
         slideAdjust = Math.round(changeX / slideAdjust);
         
         var newLeft = slideAdjust + left;
         
         /*
          * We need to calculate the closest column so we can figure out
          * where to snap the grid to.
          */
         var t = newLeft % touchslider2.colWidth;
         
         if ((Math.abs(t)) > ((touchslider2.colWidth / 2))) {
             /*
              * Show the next cell
              */
             newLeft -= (touchslider2.colWidth - Math.abs(t));
         } else {
             /*
              * Stay on the current cell
              */
             newLeft -= t;
         }
         
         if (touchslider2.slidingLeft) {
             var maxLeft = parseInt('-' + (touchslider2.width - elem.parent().width()), 10);
             /*
              * Sliding to the left
              */
             touchslider2.doSlide(elem, Math.max(maxLeft, newLeft), '0.5s');
         } else {
             /*
              * Sliding to the right
              */
             touchslider2.doSlide(elem, Math.min(0, newLeft), '0.5s');
         }
         
         elem.parent().removeClass('sliding');
         touchslider2.startX = null;
    },
    
    doSlide: function(/*jQuery*/ elem, /*int*/ x, /*string*/ duration) {
         elem.css({
             left: x + 'px',
             '-webkit-transition-property': 'left',
             '-webkit-transition-duration': duration
         });
    },
    
    /**
     * While they are actively dragging we just need to adjust the
     * position of the grid using the place they started and the
     * amount they've moved.
     */
    touchMove: function(/*JQuery*/ elem, /*event*/ e) {
         if (!touchslider2.sliding) {
             elem.parent().addClass('sliding');
         }
         
         touchslider2.sliding = true;
         
         if (touchslider2.startX > e.targetTouches[0].clientX) {
             /*
              * Sliding to the left
              */
             elem.css('left', '-' + (touchslider2.startX - e.targetTouches[0].clientX - touchslider2.startLeft) + 'px');
             touchslider2.slidingLeft = true;
         } else {
             /*
              * Sliding to the right
              */
             var left = (e.targetTouches[0].clientX - touchslider2.startX + touchslider2.startLeft);
             elem.css('left', left + 'px');
             touchslider2.slidingLeft = false;
         }
         
    }
};
