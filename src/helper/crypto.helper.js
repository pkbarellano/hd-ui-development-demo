import HmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';

const hmacSHA256 = data => {

    const secret = "9x2rTsyBqcAC8GDH0KypEXYsbBEyKQR7";

    const jsonString = JSON.stringify(data);

    const hashDigest = HmacSHA256(jsonString, secret);

    const base64Digest = Hex.stringify(hashDigest);

    return base64Digest;
};

export default hmacSHA256;