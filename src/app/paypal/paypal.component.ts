import { Component, AfterViewInit } from '@angular/core';
//Este es el simulador de pagos de paypal, recuerden que solo sirve con cuentas ficticias y no se pueden hacer pagos reales.
declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
})
export class PaypalComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '250.00' //Aca es donde se cobra la cantidad de la reservacion falsa
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert('Pago simulado completado por ' + details.payer.name.given_name); //cambiar el alert por qr o alert bonito
          console.log('Detalles de la transacción:', details);
        });
      },
      onCancel: (data: any) => {
        alert('Pago cancelado.');
      },
      onError: (err: any) => {
        console.error('Error en PayPal:', err);
      }
    }).render('#paypal-button-container');
  }
}
