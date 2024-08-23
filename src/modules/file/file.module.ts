import { forwardRef, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => UserModule)],
  exports: [FileService],
  providers: [FileService],
})
export class FileModule {}
