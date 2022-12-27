
import jwt_decode from 'jwt-decode'
export default function verifyToken(accessToken) {
    let decodedToken = jwt_decode(accessToken);

    let currentDate = new Date();
    
    if (decodedToken?.exp * 1000 < currentDate.getTime()) {
        return false
    } else {
        return true
    }
}