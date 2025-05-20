import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UsersModule } from './modules/users/users.module';
import { MoviesModule } from './modules/movies/movies.module';

@Module({
  imports: [CoreModule, UsersModule, MoviesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
