import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CurrentUser } from "src/auth/types/current-user.type";

export const RequestUser = createParamDecorator((_data: any, ctx: ExecutionContext): CurrentUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
})