import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { StyleManagerService } from '@/services/style/style-manager.service';
import { NotificationService } from '@/services/sys/notification.service';
import { SessionService } from '@/services/sys/session.service';
import { UserService } from '@/services/sys/user.service';
import { UserProfileService } from '@/services/sys/user-profile.service';
import { ThemeService } from '@/services/style/theme.service';

@NgModule({
  imports: [],
  providers: [
    provideHttpClient(),
    ThemeService,
    StyleManagerService,
    NotificationService,
    SessionService,
    UserService,
    UserProfileService,
  ]
})
export class ServiceModule {

}
