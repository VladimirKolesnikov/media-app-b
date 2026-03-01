import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MediaOutDto } from "./dto/media.out.dto";

const forController = () => applyDecorators(
    ApiTags('Media'),
)

const forCreateMedia = () => applyDecorators(
    ApiOperation({ summary: 'Upload a media to my page' }),
    ApiBearerAuth('access-token'),
    ApiCreatedResponse({ type: MediaOutDto }),
    ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
    }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    }),
);

const forGetMyMedia = () => applyDecorators(
    ApiOperation({ summary: 'Get the media from my page as list' }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({ type: MediaOutDto, isArray: true }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    }),
)

const forGetMediaById = () => applyDecorators(
    ApiOperation({ summary: 'Get a media item by id' }),
    ApiBearerAuth('access-token'),
    // ApiOkResponse({ type: MediaResponseDto }),
    ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    }),
)




export const ApiMedia = {
    forController,
    forCreateMedia,
    forGetMyMedia,
    forGetMediaById,
};
