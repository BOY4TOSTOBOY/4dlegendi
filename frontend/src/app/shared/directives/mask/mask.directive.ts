import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";

const PLACEHOLDERS = {
  A: "^[a-zA-ZA-zА-яЁё]",
  "0": "\\d",
};

const KEYS = {
  BACKSPACE: 8,
  LEFT: 37,
  RIGHT: 39,
  DEL: 46,
  ENTER: 13,
};

interface IState {
  value: string;
}

@Directive({
  selector: "[mask]",
})
export class InputMaskDirective implements OnInit {
  private state: IState;

  @Input() mask: any;
  @Output() ngModelChange = new EventEmitter();

  constructor(private element: ElementRef) {
    this.state = {
      value: this.getValue(),
    };
  }

  @HostListener("input")
  public onChange(): void {
    this.applyMask(this.getClearValue(this.getValue()));
  }

  @HostListener("keypress", ["$event"])
  public onKeyPress(event): void {
    if (!this.mask) {
      return;
    }

    const key = this.getKey(event);

    if (key === KEYS.BACKSPACE || key === KEYS.LEFT || key === KEYS.RIGHT) {
      return;
    }

    const cursorPosition = this.getCursorPosition();
    let regexp = this.createRegExp(cursorPosition);

    if (
      (regexp != null && !regexp.test(event.key)) ||
      this.getValue().length >= this.mask.length
    ) {
      if (key === KEYS.ENTER) {
        return;
      }

      event.preventDefault();
    }
  }

  @HostListener("keydown", ["$event"])
  public onKeyDown(event): void {
    const key = this.getKey(event);

    if (
      (key === KEYS.BACKSPACE || key === KEYS.DEL) &&
      this.getClearValue(this.getValue()).length === 1
    ) {
      this.setValue("");
      this.state.value = "";
      this.ngModelChange.emit("");
    }
  }

  public ngOnInit(): void {
    this.applyMask(this.getClearValue(this.getValue()));
  }

  private getKey(event) {
    return event.keyCode || event.charCode;
  }

  private applyMask(value): void {
    if (!this.mask) {
      return;
    }

    let newValue = "";
    let maskPosition = 0;

    if (
      this.getClearValue(value).length > this.getClearValue(this.mask).length
    ) {
      this.setValue(this.state.value);

      return;
    }

    for (let i = 0; i < value.length; i++) {
      let current = value[i];

      let regexp = this.createRegExp(maskPosition);
      if (regexp != null) {
        if (!regexp.test(current)) {
          this.setValue(this.state.value);
          break;
        }
        newValue += current;
      } else if (this.mask[maskPosition] === current) {
        newValue += current;
      } else {
        newValue += this.mask[maskPosition];
        i--;
      }

      maskPosition++;
    }

    const nextMaskElement = this.mask[maskPosition];
    if (
      value.length &&
      nextMaskElement != null &&
      /^[-\/\\^$#&@№:<>_\^!*+?.()|\[\]{}]/.test(nextMaskElement)
    ) {
      newValue += nextMaskElement;
    }

    const oldValue = this.state.value;
    const cursorPosition = this.getCursorPosition();
    this.setValue(newValue);
    this.state.value = newValue;

    if (oldValue.length >= cursorPosition) {
      this.setCursorPosition(cursorPosition);
    }
  }

  private createRegExp(position): RegExp | null {
    if (!this.mask) {
      return;
    }

    if (this.mask[position] == null) {
      return null;
    }

    const currentSymbol = this.mask[position].toUpperCase();
    const _keys = Object.keys(PLACEHOLDERS);
    const searchPosition = _keys.indexOf(currentSymbol);

    if (searchPosition >= 0) {
      return new RegExp(PLACEHOLDERS[_keys[searchPosition]], "gi");
    }

    return null;
  }

  private getValue(): string {
    return this.element.nativeElement.value;
  }

  private getClearValue(value): string {
    return value.trim().replace(/[-\/\\^$#&@№:<>_\^!*+?.()|\[\]{}]/gi, "");
  }

  private setValue(value: string): void {
    this.element.nativeElement.value = value;
  }

  private getCursorPosition(): number {
    return this.element.nativeElement.selectionStart;
  }

  private setCursorPosition(start: number, end: number = start): void {
    this.element.nativeElement.setSelectionRange(start, end);
  }
}
