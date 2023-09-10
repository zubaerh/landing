import { Injectable } from '@angular/core';
import { Observable, Subject, of, scan } from 'rxjs';

export interface Command {
  id: number;
  type: 'success' | 'error' | 'clear';
  text?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  messagesInput: Subject<Command>= new Subject();
  messagesOutput: Observable<Command[]>= of([]);

  constructor() {
    this.messagesInput = new Subject<Command>();
    this.messagesOutput = this.messagesInput.pipe(
      scan((acc: Command[], value: Command) => {
        if(value.type === 'clear'){
          return acc.filter(message => message.id !== value.id);
        } else {
          return [...acc, value];
        }
      }, [])
    );
   }


  addSuccess(message: string){
    const id = this.randomId();
    this.messagesInput.next({
      id,
      text: message,
      type: 'success'
    });
    setTimeout(() => {
      this.clearMessage(id);
    }, 5000);
  }

  addError(message: string){
    const id = this.randomId();
    this.messagesInput.next({
      id,
      text: message,
      type: 'error'
    });

    setTimeout(() => {
      this.clearMessage(id);
    }, 5000);
  }

  clearMessage(id: number){
    this.messagesInput.next({
      id,
      type: 'clear'
    });
  }

  private randomId(){
    return Math.round(Math.random() * 10000);
  }
 
}
