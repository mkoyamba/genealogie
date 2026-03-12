import AWS from "aws-sdk";
import { useRef, useState } from "react";

function FileUploader() {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [file, setFile] = useState<File | null>(null);
	const [fileName, setFileName] = useState("");
	const [extension, setExtension] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const uploadFile = async () => {
		if (!file) return;

		const S3_BUCKET = "koyamba-family-tree-files";
		const REGION = "eu-west-3";

		AWS.config.update({
			accessKeyId: process.env.REACT_APP_AWS_KEY_ID,
			secretAccessKey: process.env.REACT_APP_AWS_KEY_SECRET,
		});

		const s3 = new AWS.S3({
			params: { Bucket: S3_BUCKET },
			region: REGION,
		});

		const finalName = `${fileName}${extension}`;

		const params = {
			Bucket: S3_BUCKET,
			Key: `active/${finalName}`,
			Body: file,
		};

		try {
			await s3.putObject(params).promise();
			console.log("Upload réussi :", finalName);

			setIsModalOpen(false);
			setFile(null);
			setFileName("");
			setExtension("");
		} catch (err) {
			console.error(err);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;

		const lastDotIndex = selectedFile.name.lastIndexOf(".");

		let baseName = selectedFile.name;
		let ext = "";

		if (lastDotIndex > 0) {
			baseName = selectedFile.name.substring(0, lastDotIndex);
			ext = selectedFile.name.substring(lastDotIndex);
		}

		setFile(selectedFile);
		setFileName(baseName);
		setExtension(ext);
		setIsModalOpen(true);

		e.target.value = "";
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setFile(null);
		setFileName("");
		setExtension("");
	};

	return (
		<div className="FileUploader">
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>

			<button style={style.buttonChooseFile} onClick={handleButtonClick}>Choisir un fichier</button>

			{isModalOpen && (
				<div style={style.overlayStyle}>
					<div style={style.modalStyle}>
						<h3>Renommer le fichier</h3>

						<p>
							Nom actuel : <strong>{file?.name}</strong>
						</p>

						<div style={{ marginBottom: "16px" }}>
							<label style={{ display: "block", marginBottom: "8px" }}>
								Nouveau nom
							</label>

							<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
								<input
									value={fileName}
									onChange={(e) => setFileName(e.target.value)}
									style={style.inputStyle}
								/>
								<span>{extension}</span>
							</div>
						</div>

						<div style={style.buttonRowStyle}>
							<button onClick={handleCancel} style={style.secondaryButtonStyle}>
								Annuler
							</button>
							<button
								onClick={uploadFile}
								style={style.primaryButtonStyle}
								disabled={!fileName.trim()}
							>
								Upload
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
const style = {
	buttonChooseFile: {
		width: "10vw",
		height: "4vh",
		backgroundColor: "rgba(231, 50, 50, 0.5)"
	},
	overlayStyle: {
		position: "fixed" as const,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1000,
	},

	modalStyle: {
		backgroundColor: "#fff",
		padding: "24px",
		borderRadius: "12px",
		width: "90%",
		maxWidth: "400px",
		boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
	},

	inputStyle: {
		flex: 1,
		padding: "10px 12px",
		borderRadius: "8px",
		border: "1px solid #ccc",
	},

	buttonRowStyle: {
		display: "flex",
		justifyContent: "flex-end",
		gap: "12px",
	},

	secondaryButtonStyle: {
		padding: "10px 16px",
		borderRadius: "8px",
		border: "1px solid #ccc",
		background: "#fff",
		cursor: "pointer",
	},

	primaryButtonStyle: {
		padding: "10px 16px",
		borderRadius: "8px",
		border: "none",
		background: "#000",
		color: "#fff",
		cursor: "pointer",
	}
}

export default FileUploader;