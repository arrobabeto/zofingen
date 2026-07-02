import fs from "node:fs"
import { dedent } from "ts-dedent"

if (!fs.existsSync(".env")) {
  console.log("create .env file...")
  await fs.writeFileSync(
    ".env",
    dedent`
      HOST=localhost
      PORT=3000
      
      ORBITYPE_API_SQL_URL=https://core.orbitype.com/api/sql/v1
      ORBITYPE_API_SQL_KEY=

      ORBITYPE_API_S3_URL=https://core.orbitype.com/api/s3/v1
      ORBITYPE_API_S3_KEY=
    `,
  )
}
