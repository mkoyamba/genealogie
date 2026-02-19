import AWS from "aws-sdk";
import { useRef, useState } from "react";

function FileUploader() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const uploadFile = async (file: File) => {

		const S3_BUCKET = "koyamba-family-tree-files";
		const REGION = "eu-west-3";

		AWS.config.update({
			accessKeyId: process.env.REACT_APP_AWS_KEY_ID, //TODO
			secretAccessKey: process.env.REACT_APP_AWS_KEY_SECRET, //TODO
		});
		const s3 = new AWS.S3({
			params: { Bucket: S3_BUCKET },
			region: REGION,
		});


		const params = {
			Bucket: S3_BUCKET,
			Key: `active/${file.name}`,
			Body: file,
		};


		var upload = s3
			.putObject(params)
			.on("httpUploadProgress", (evt) => {
				console.log(
					"Uploading " + String((evt.loaded * 100) / evt.total) + "%"
				)}
			)
			.promise();
		await upload.then((err) => {
			console.log(err);
		});
	};
	const handleFileChange = (e:any) => {
		const file = e.target.files[0];
		uploadFile(file)
	}

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	}

	return (
		<div className="FileUploader">
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>
			<button
				type="button"
				className="upload-button"
				onClick={handleButtonClick}
			>
				Upload File
			</button>
		</div>
	);
}

export default FileUploader;