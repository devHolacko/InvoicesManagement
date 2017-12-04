import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs/Subscription'

import { LoaderService } from '../../shared/services/loader.service'
import { ILoadingState } from '../../shared/interfaces/ILoadingState'

@Component({
    selector: "loading",
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
    private show: boolean = false;
    private subscription: Subscription;

    ngOnInit() {
        this.subscription = this.loaderService.loaderState.subscribe((state: ILoadingState) => {
            this.show = state.show;
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }



    constructor(private loaderService: LoaderService) {

    }
}