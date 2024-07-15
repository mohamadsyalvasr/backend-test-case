import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './modules/members/members.module';
import { BooksModule } from './modules/books/books.module';
import { BorrowsModule } from './modules/borrows/borrows.module';
import { MongooseModule } from "@nestjs/mongoose";
import { Member, MemberSchema } from "./modules/members/entities/member.entity";
import { MockDataService } from "./seeders/mock-data.service";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { ExceptionsFilter } from "./common/filters/exceptions.filter";
import { Book, BookSchema } from "./modules/books/entities/book.entity";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/eigen3-lib'),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MembersModule, BooksModule, BorrowsModule],
  controllers: [AppController],
  providers: [
    AppService, MockDataService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})

export class AppModule implements OnModuleInit, NestModule {
  constructor(private readonly mockDataService: MockDataService) {}

  async onModuleInit() {
    await this.mockDataService.insertMockData();
  }

  configure(consumer: MiddlewareConsumer): any {
  }
}
