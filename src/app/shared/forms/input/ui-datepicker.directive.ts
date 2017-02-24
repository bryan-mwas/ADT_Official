import { Directive, ElementRef, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

declare var $: any;

@Directive({
  selector: '[saUiDatepicker]'
})
export class UiDatepickerDirective implements OnInit, OnChanges {

  @Input() saUiDatepicker: any;
  @Output() selectDate: EventEmitter<any> = new EventEmitter<any>();
  @Input() setDate: string;
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    let onSelectCallbacks = [];
    let saUiDatepicker = this.saUiDatepicker || {};
    let element = $(this.el.nativeElement);

    if (saUiDatepicker.minRestrict) {
      onSelectCallbacks.push((selectedDate) => {
        $(saUiDatepicker.minRestrict).datepicker('option', 'minDate', selectedDate);
      });
    }
    if (saUiDatepicker.maxRestrict) {
      onSelectCallbacks.push((selectedDate) => {
        $(saUiDatepicker.maxRestrict).datepicker('option', 'maxDate', selectedDate);
      });
    }

    //Let others know about changes to the data field
    onSelectCallbacks.push((selectedDate) => {
      element.triggerHandler("change");

      let form = element.closest('form');

      if (typeof form.bootstrapValidator == 'function') {
        try {
          form.bootstrapValidator('revalidateField', element);
        } catch (e) {
          console.log(e.message)
        }
      }
    });

    let options = $.extend(saUiDatepicker, {
      prevText: '<i class="fa fa-chevron-left"></i>',
      nextText: '<i class="fa fa-chevron-right"></i>',
      onSelect: (selectedDate) => {
        onSelectCallbacks.forEach((callback) => {
          callback.call(callback, selectedDate)
          // Exposes the value of the selected date to respective component
          this.selectDate.emit(selectedDate);
        })
      }
    });

    element.datepicker(options);

  }
  /**
     * Date: 1/24/2017
     * This is the best way I have come up with to programatically change the date.
     * onChanges: Checks changes to the value of the @Input. This enables automatic
     * change of the date based on the user input.
     */
  ngOnChanges(): void {
    let element = $(this.el.nativeElement);
    // Implement jQueryUI datepicker methods
    element.datepicker("setDate", this.setDate);
  }

}
