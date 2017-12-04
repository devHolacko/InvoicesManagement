import {Injectable} from '@angular/core'
import {Subject} from 'rxjs/Subject'

import {ILoadingState} from '../interfaces/ILoadingState'

@Injectable()

export class LoaderService{
    private loaderSubject   = new Subject<ILoadingState>();
    public loaderState = this.loaderSubject.asObservable();
   
    constructor(){
        
    }

    show(){
        this.loaderSubject.next(<ILoadingState>{show:true});
    }

    hide(){
        this.loaderSubject.next(<ILoadingState>{show:false});
    }
}