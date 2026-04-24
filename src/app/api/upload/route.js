import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("file");
		const employee_id = formData.get("employee_id");

		if (!file || typeof file === "string") {
			return NextResponse.json(
				{ error: "No valid file uploaded — received string instead of File" },
				{ status: 400 }
			);
		}

		const bytes = await file?.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const safeName = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9.\-_]/g, "_");
		const uuid = crypto.randomUUID();
		const s3Key = `documents/${employee_id || 'unassigned'}/${uuid}-${safeName}`;

		await s3.send(
			new PutObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: s3Key,
				Body: buffer,
				ContentType: file.type,
			})
		);

		const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

		console.log(`File uploaded successfully: ${fileUrl}`);

		return NextResponse.json({
			success: true,
			fileUrl,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Upload failed" },
			{ status: 500 }
		);
	}
}