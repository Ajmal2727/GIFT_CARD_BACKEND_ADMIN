export const cookieOpt = {
    httpOnly: true,
    secure: true, // Ensure cookies are sent only over HTTPS
    sameSite: 'Strict', // More secure than 'None'
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
};


// CORS Configuration for Production
export const corsOptions = {
    // origin: ["https://ballysfather.com"], // Only allow requests from your domain
    origin: ["http://localhost:5173","http://localhost:5174"], // Only allow requests from your domain
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Necessary headers
};





export const DB_NAME = 'ballysfather';

export const saltOrRounds = 10;

export const socketMSG = {
    JOIN_GAME: "JOIN_GAME",
    PLACE_BET: "PLACE_BET",
    GET_ROUND_UPDATE: "GET_ROUND_UPDATE",
    END_ROUND: "END_ROUND"
};


  // ✅ Validate Launch Token
//  export const tokens = [
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBSUFJMDAwNDEiLCJpYXQiOjE3NDEzMjQ0ODAsImV4cCI6MTc0MTkyOTI4MH0.QN5QU6ZwXLYO-I8epdr4c75XK3NXKb-nWC4RyjobKkY",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBSUFJMDAwNDEiLCJpYXQiOjE3NDEzMjQ1MDQsImV4cCI6MTc0MTkyOTMwNH0.PcXfW9R50t0yQjxTXYaprVzn0nqBtj7RpwgWYfwvgmo",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBSUFJMDAwNDAiLCJpYXQiOjE3NDEzMzU1NzEsImV4cCI6MTc0MTk0MDM3MX0.8OQYsmGaEBgZQp22GDNvvmmpSEBMG_Iw2VDi99wHoyQ",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBSUFJMDAwNDAiLCJpYXQiOjE3NDEzMzU1OTQsImV4cCI6MTc0MTk0MDM5NH0.auYLC5EtnwcczMyhOpMFwZ5bY-16HymwmR57RhP1xvI"
//   ];

export const tokens =
[
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBSUFJMDAwNDAiLCJpYXQiOjE3NDE1OTA5NDUsImV4cCI6MTc0MjE5NTc0NX0.E6tmKhSRzHfzBicboE5xOwZFbRVLooPedzRwZ89OMxw",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBSUFJMDAwNDAiLCJpYXQiOjE3NDE1OTA5NjIsImV4cCI6MTc0MjE5NTc2Mn0.VA89GRBoH76mh4T9B_2Ekzf-KPBOyINJRDtQQ3GZ2i0"
]