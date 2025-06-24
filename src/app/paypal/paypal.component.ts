import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { PaypalService } from '../paypal.service';

//Este es el simulador de pagos de paypal, recuerden que solo sirve con cuentas ficticias y no se pueden hacer pagos reales.
declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
})
export class PaypalComponent implements AfterViewInit {
  @Output() pagoCompleto=new EventEmitter<void>();

  constructor(private paypalService: PaypalService) {}

  ngAfterViewInit(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.paypalService.total.toFixed(2)
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          Swal.fire({
            title: 'Pago simulado completo!',
            text: 'Hecho por: ' + details.payer.name.given_name,
            icon: 'success'
          });
          console.log('Detalles de la transacción:', details);
          this.pagoCompleto.emit(); //para avisar que el pago se ejecuto con exito
        });
      },
      onCancel: (data: any) => {
        Swal.fire({
          title: 'Pago cancelado',
          icon: 'error'
        });
      },
      onError: (err: any) => {
        console.error('Error en PayPal:', err);
      }
    }).render('#paypal-button-container');
  }
}