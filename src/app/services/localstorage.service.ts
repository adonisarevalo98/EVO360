import { Injectable, Output, EventEmitter } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment.prod';
;
@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  //Activador de eventos tras seleccion de una evaluación 
  @Output() evaluationData: EventEmitter<any> = new EventEmitter();
  constructor() {
    
   }
   /* -------------------MÉTODOS PARA GESTIÓN DE ID-----------------*/

   /* A través de este servicio se almacenan, obtienen y eliminan los ID de cualquier
      elemento al que se le quiera aplicar un select, update u otro método que implique 
      su uso en diferentes componentes*/

      //***********************************DE USO INMEDIATO************************* */
      //Se eliminan tras la finalización de carga de una componente


   // Función que almacena el id del campo seleccionado
   setSelectedId(idselected) {
     let id = CryptoJS.AES.encrypt(idselected.toString(),environment.SECRET);
    localStorage.setItem('SelectedId', id);
   }
   //Funcion que retorna el id del dal campo seleccionado
   getSelectedId() {
     try {
      let id = CryptoJS.AES.decrypt(localStorage.getItem('SelectedId'),environment.SECRET);
      return id.toString(CryptoJS.enc.Utf8);
     } catch (error) {
       return null
     }
    }
    //eliminacion del id
    deleteSelectedId() {
      localStorage.removeItem('SelectedId');
      }


      //**************************************DE USO TEMPORAL************************* */
      //Se eliminan tras activar un método

      //Para gestion de evaluadores
      setEvaluationdId(idselected) {
        let id = CryptoJS.AES.encrypt(JSON.stringify(idselected),environment.SECRET);
       localStorage.setItem('EvaluationId', id);
      }
      //Funcion que retorna el id del del campo seleccionado
      getEvaluationId() {
        try {
          let id = CryptoJS.AES.decrypt(localStorage.getItem('EvaluationId'),environment.SECRET);
          return id.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          return null
        }
       }
       //eliminacion del id
       deleteEvaluationId() {
         localStorage.removeItem('EvaluationId');
         }
         
          //************************************ */
          //Para gestion de criterios
      setCritGroupId(idselected) {
        let id = CryptoJS.AES.encrypt(JSON.stringify(idselected),environment.SECRET);
       localStorage.setItem('CritGroupId', id);
      }
      //Funcion que retorna el id del del campo seleccionado
      getCritGroupId() {
        try {
          let id = CryptoJS.AES.decrypt(localStorage.getItem('CritGroupId'),environment.SECRET);
          return id.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          return null
        }
       }
       //eliminacion del id
       deleteCritGroupId() {
         localStorage.removeItem('CritGroupId');
         }


          //************************************ */
          //Para realización de evaluación (consulta de items y ratings)
      setEvadId(idselected) {
        let id = CryptoJS.AES.encrypt(JSON.stringify(idselected),environment.SECRET);
       localStorage.setItem('EvaId', id);
      }
      //Funcion que retorna el id del del campo seleccionado
      getEvaId() {
        try {
          let id = CryptoJS.AES.decrypt(localStorage.getItem('EvaId'),environment.SECRET);
          return id.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          return null
        }
       }
       //eliminacion del id
       deleteEvaId() {
         localStorage.removeItem('EvaId');
         }
}
