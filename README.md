# minecraft-realms-map-node

Node.js Minecraft Realms backup downloader and map generator

## Installation

- Run the below install script that matches your platform:

- `scripts/install-linux.sh`

- `scripts/install-osx.sh`

### AWS S3 Setup

10. If you're using an AWS S3 bucket to upload the map, run the below to configure your connection to S3:

    ```
    aws configure --profile minecraft-s3-map-uploader
    ```

    When prompted you need to set _AWS Access Key ID_ and _AWS Secret Access Key_ - copy and paste them from your confirmation
    email or from your Amazon account page. Be careful when copying them! They are case sensitive and must be entered
    accurately or you'll keep getting errors about invalid signatures or similar when attempting to sync to s3.

    If you don't have an IAM user set up, create one in the [IAM Dashboard](https://console.aws.amazon.com/iam/home)
    and add the following policy to it:

    ```
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "Stmt1397834652000",
                "Effect": "Allow",
                "Action": [
                    "s3:ListAllMyBuckets"
                ],
                "Resource": [
                    "arn:aws:s3:::*"
                ]
            },
            {
                "Sid": "Stmt1397834745000",
                "Effect": "Allow",
                "Action": [
                    "s3:ListBucket",
                    "s3:PutObject",
                    "s3:PutObjectAcl",
                    "s3:DeleteObject",
                    "s3:DeleteObjectVersion",
                    "s3:PutLifeCycleConfiguration"
                ],
                "Resource": [
                    "arn:aws:s3:::BUCKET_NAME*",
                    "arn:aws:s3:::BUCKET_NAME/*"
                ]
            }
        ]
    }
    ```

    where `BUCKET_NAME` is the name of the S3 bucket you will be uploading the map to.

## Developers

- [Minecraft Yggdrasil Auth System Wiki Page](https://wiki.vg/Authentication)

## Disclaimer

THIS PROGRAM AND ITS REQUIRED DEPENDENCIES ARE PROVIDED AS-IS AND NO WARRANTY IS IMPLIED. I WILL NOT BE RESPONSIBLE FOR
LOSS OF DATA OR MINECRAFT ACCOUNT ACCESS CAUSED BY IMPROPER USE OF THIS PROGRAM.

Use of this tool is not endorsed by Mojang. While the original authentic version of this tool will not use your
Minecraft username and password or access token for malicious purposes, it is your responsibility to ensure that the
computer or server you install it on is secure as your password will be stored in plain text on disk.
