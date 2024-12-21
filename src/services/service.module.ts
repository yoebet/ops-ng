import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StyleManager } from '@/services/style/style-manager';
import { NotificationService } from '@/services/sys/notification.service';
import { SessionService } from '@/services/sys/session.service';
import { UserService } from '@/services/sys/user.service';
import { UserProfileService } from '@/services/sys/user-profile.service';
import { ThemeService } from '@/services/style/theme.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AUTHORIZATION_HEADER, LocalStorageKeys } from '@/constants';
import { StrategyService } from '@/services/strategy/strategy.service';
import { StrategyTemplateService } from '@/services/strategy/strategy-template.service';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { KlineDataService } from '@/services/market-data/kline-data.service';
import { ExKlineDataService } from '@/services/market-data/ex-kline-data.service';

@NgModule({
  imports: [
    JwtModule.forRoot({
      config: {
        headerName: AUTHORIZATION_HEADER,
        tokenGetter: () => localStorage.getItem(LocalStorageKeys.AccessToken),
        allowedDomains: ['localhost'],
        // disallowedRoutes: [""],
      },
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ThemeService,
    StyleManager,
    NotificationService,
    SessionService,
    UserService,
    UserProfileService,
    StrategyTemplateService,
    StrategyService,
    BacktestStrategyService,
    KlineDataService,
    ExKlineDataService,
  ]
})
export class ServiceModule {

}
