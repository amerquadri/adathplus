import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class MarathiName {
    public readonly farmer: string = "शेतकरी";
    public readonly vendor: string = "विक्रेता";
    public readonly bill: string = "बिल";
    public readonly particular: string = "तपशील";
    public readonly amount: string = "रक्कम";
    public readonly date: string = "दिनांक";
    public readonly customer: string = "ग्राहक";
    public readonly item: string = "आयटम";
    public readonly payment: string = "पेमेंट";
}
