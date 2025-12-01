import { Injectable, Logger } from "@nestjs/common";

interface NotificationPayload {
  userId: number;
  title: string;
  body: string;
}

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  async sendNotification(payload: NotificationPayload) {
    // Mock: hanya log ke console
    this.logger.log(
      `Sending notification to user ${payload.userId}: ${payload.title} - ${payload.body}`
    );
    // TODO: integrasi FCM sesungguhnya di sini
    return { success: true };
  }
}
