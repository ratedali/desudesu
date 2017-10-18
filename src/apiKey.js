export const key = "100";

let redirectUrl;
let originUrl;
if(process.env.NODE_ENV === 'production') {
    redirectUrl = "https://desudesu.surge.sh/login";
    originUrl = "https://desudesu.surge.sh";
} else {
    redirectUrl = "http://localhost:3000/login";
    originUrl = "http://localhost:3000"
}

export const redirect = redirectUrl;
export const origin = originUrl;