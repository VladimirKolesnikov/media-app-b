import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


const forController = () => applyDecorators(
  ApiTags('Users'),
)

const forFindAll = () => applyDecorators(
  ApiOperation({ summary: 'Get list of users' }),
  ApiBearerAuth('access-token'),
  ApiOkResponse({}),
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are unauthorized',
  })
);

const forUsersProfile = () => applyDecorators(
  ApiOperation({ summary: 'Get a user`s profile' }),
  ApiBearerAuth('access-token'),
  ApiOkResponse({}),
  ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  }),
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are unauthorized',
  })
)

const forUsersMedia = () => applyDecorators(
  ApiOperation({ summary: 'Get a user`s media' }),
  ApiBearerAuth('access-token'),
  ApiOkResponse({}),
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are unauthorized',
  })
)

const forMyProfile = () => applyDecorators(
  ApiOperation({ summary: 'Get my personal data' }),
  ApiBearerAuth('access-token'),
  ApiOkResponse({}),
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are unauthorized',
  })
)


export const ApiUser = {
  forController,
  forFindAll,
  forUsersProfile,
  forUsersMedia,
  forMyProfile,
};
