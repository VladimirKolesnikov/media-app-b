import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserResponseDto } from "./dto/user-response.dto";


const forController = () => applyDecorators(
  ApiTags('Users'),
)

const forGetUsers = () => applyDecorators(
  ApiOperation({ summary: 'Return a list of users with the base user`s information' }),
  ApiBearerAuth('access-token'),
  ApiOkResponse({ 
    type: UserResponseDto,
    isArray: true
  }),
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are unauthorized',
  })
);

const forGetUserById = () => applyDecorators(
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

const forGetUserMedia = () => applyDecorators(
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
  forGetUsers,
  forGetUserById,
  forGetUserMedia,
  forMyProfile,
};
