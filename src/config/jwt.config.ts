import { JwtModuleOptions } from "@nestjs/jwt"

export const getJwtConfig = (): JwtModuleOptions => {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }

  return {
    secret,
    signOptions: { algorithm: 'HS256' },
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
};

// JwtModule.registerAsync({
//   useFactory: () => ({
//     secret: process.env.JWT_SECRET_KEY,
//     signOptions: { algorithm: 'HS256' },
//   }),
// });
