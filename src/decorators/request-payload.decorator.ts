import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "src/auth/types/jwt-payload.type";

export const RequestPayload = createParamDecorator((_data: any, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
})