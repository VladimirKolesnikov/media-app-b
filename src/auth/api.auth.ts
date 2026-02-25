import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthOutDto } from "./dto/auth.out.dto";
import { MeOutDto } from "./dto/me.out.dto";

const forController = () => applyDecorators(
  ApiTags('Authentication and authorization'),
)

const forRegister = () => applyDecorators(
  ApiOperation({ summary: 'Create a new user`s account' }),
  ApiCreatedResponse({ type: AuthOutDto }),
  ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  }),
  ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email alerady exists',
  }),
);

const forLogin = () => applyDecorators(
  ApiOperation({ summary: 'Authenticate user' }),
  ApiOkResponse({ type: AuthOutDto }),
  ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  }),
  ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wrong email or password',
  }),
)

const forRefresh = () => applyDecorators(
  ApiOperation({ summary: 'Refresh the user`s tokens when the access token expires' }),
  ApiOkResponse({ type: AuthOutDto }),
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The refresh token is missing or invalid',
  }),
  ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No user found for the given refresh token',
  }),
)

const forLogout = () => applyDecorators(
  ApiOperation({ summary: 'Log out the user by removing the refresh token' }),
  ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Logout successful, refresh token cleared from cookie',
  }),
)

const forMe = () => applyDecorators(
  ApiOperation({ summary: 'Get the user`s auth info' }),
  ApiBearerAuth('access-token'),
  ApiOkResponse({ type: MeOutDto }),
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  }),
  ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No user found for the given access token',
  }),
)


export const ApiAuth = {
  forController,
  forRegister,
  forLogin,
  forRefresh,
  forLogout,
  forMe,
};
