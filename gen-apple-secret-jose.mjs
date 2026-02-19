
import { SignJWT } from "jose"
import { createPrivateKey } from "crypto"

// Hardcoded values for simplicity
const team_id = "94QM2H5CQQ"
const client_id = "com.masjid.alfalah.web"
const key_id = "L4MW66P246"
const private_key = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgG8jwVAU4iiqL6n0R
s1tTMcVyd5vNaQSgMz0/kSxcF8GgCgYIKoZIzj0DAQehRANCAARAoKzGQEpSkFbt
mHTYAalqyhkhIFPiGlAfvZTFAvwwbvKPFn3wdiHDynzWw3NlAtcWTIn2/Ef9+LGZ
AdpusihO
-----END PRIVATE KEY-----`

const expires_in = 86400 * 180
const expiresAt = Math.ceil(Date.now() / 1000) + expires_in

console.log(`Apple client secret generated. Valid until: ${new Date(expiresAt * 1000)}`)

const jwt = await new SignJWT({})
    .setAudience("https://appleid.apple.com")
    .setIssuer(team_id)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .setSubject(client_id)
    .setProtectedHeader({ alg: "ES256", kid: key_id })
    .sign(createPrivateKey(private_key.replace(/\\n/g, "\n")))

console.log(jwt)
