import AWS from "aws-sdk";
import { useRef, useState } from "react";

type UploadStatus = "pending" | "uploading" | "done" | "error";

type UploadItem = {
	id: string;
	file: File;
	fileName: string;
	extension: string;
	status: UploadStatus;
};

type Props = {
	text: string | undefined;
};

function FileUploader(props: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [files, setFiles] = useState<UploadItem[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const S3_BUCKET = "koyamba-family-tree-files";
	const REGION = "eu-west-3";

	AWS.config.update({
		accessKeyId: process.env.REACT_APP_AWS_KEY_ID,
		secretAccessKey: process.env.REACT_APP_AWS_KEY_SECRET,
		region: REGION,
	});

	const s3 = new AWS.S3({
		region: REGION,
	});

	const createUploadItem = (file: File): UploadItem => {
		const lastDotIndex = file.name.lastIndexOf(".");

		let baseName = file.name;
		let ext = "";

		if (lastDotIndex > 0) {
			baseName = file.name.substring(0, lastDotIndex);
			ext = file.name.substring(lastDotIndex);
		}

		return {
			id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
			file,
			fileName: baseName,
			extension: ext,
			status: "pending",
		};
	};

	const addFiles = (incomingFiles: FileList | File[]) => {
		const newItems = Array.from(incomingFiles).map(createUploadItem);

		setFiles((prev) => {
			const existing = new Set(
				prev.map((item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`)
			);

			const filtered = newItems.filter(
				(item) =>
					!existing.has(`${item.file.name}-${item.file.size}-${item.file.lastModified}`)
			);

			return [...prev, ...filtered];
		});
	};

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		if (isUploading) return;
		setIsModalOpen(false);
		setFiles([]);
		setIsDragging(false);
	};

	const handleButtonChooseFiles = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			addFiles(e.target.files);
		}
		e.target.value = "";
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files?.length) {
			addFiles(e.dataTransfer.files);
		}
	};

	const updateFileName = (id: string, newName: string) => {
		setFiles((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, fileName: newName } : item
			)
		);
	};

	const removeFile = (id: string) => {
		setFiles((prev) => prev.filter((item) => item.id !== id));
	};

	const uploadSingleFile = async (item: UploadItem) => {
		const finalName = `${item.fileName.trim()}${item.extension}`;

		if (!item.fileName.trim()) return;

		setFiles((prev) =>
			prev.map((f) => (f.id === item.id ? { ...f, status: "uploading" } : f))
		);

		const params: AWS.S3.PutObjectRequest = {
			Bucket: S3_BUCKET,
			Key: `${props.text ? "recipes/" : "active/"}${finalName}`,
			Body: item.file,
			ContentType: item.file.type || "application/octet-stream",
		};

		try {
			await s3.upload(params).promise();

			setFiles((prev) => {
				const updated = prev.filter((f) => f.id !== item.id);

				if (updated.length === 0) {
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				}

				return updated;
			});
		} catch (error) {
			console.error("Erreur upload :", finalName, error);

			setFiles((prev) =>
				prev.map((f) => (f.id === item.id ? { ...f, status: "error" } : f))
			);
		}
	};

	const uploadAllFiles = async () => {
		const validFiles = files.filter((item) => item.fileName.trim());

		if (!validFiles.length) return;

		setIsUploading(true);

		try {
			await Promise.all(validFiles.map(uploadSingleFile));
			
		} finally {
			
			setIsUploading(false);
		}
	};

	const allDone = files.length > 0 && files.every((f) => f.status === "done");

	return (
		<div className="FileUploader">
			<input
				type="file"
				multiple
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>

			<button style={styles.buttonOpen} onClick={handleOpenModal}>
				{props.text ? props.text : 'Charger des fichiers'}
			</button>

			{isModalOpen && (
				<div style={styles.overlayStyle}>
					<div style={styles.modalStyle}>
						<h3>Uploader des fichiers</h3>

						<div
							style={{
								...styles.dropzone,
								...(isDragging ? styles.dropzoneActive : {}),
							}}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={handleButtonChooseFiles}
						>
							<p style={{ margin: 0, fontWeight: 600 }}>
								Glissez-déposez vos fichiers ici {props.text && "(en .pdf)"}
							</p>
							<p style={{ margin: "8px 0 0 0" }}>
								ou cliquez pour en sélectionner plusieurs
							</p>
						</div>

						{files.length > 0 && (
							<div style={styles.filesContainer}>
								{files.map((item) => (
									<div key={item.id} style={styles.fileCard}>
										<div style={{ flex: 1 }}>
											<p style={{ margin: "0 0 8px 0" }}>
												<strong>Nom actuel :</strong> {item.file.name}
											</p>

											<div style={{ marginBottom: "10px" }}>
												<span style={{ display: "block", marginBottom: "6px" }}>
													Nouveau nom
												</span>

												<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
													<input
														value={item.fileName}
														onChange={(e) =>
															updateFileName(item.id, e.target.value)
														}
														style={styles.inputStyle}
														disabled={
															item.status === "uploading" ||
															item.status === "done"
														}
													/>
													<span>{item.extension}</span>
												</div>
											</div>

											<p style={{ margin: 0 }}>
												<strong>Statut :</strong>{" "}
												{item.status === "pending" && "En attente"}
												{item.status === "uploading" && "Upload en cours..."}
												{item.status === "done" && "Upload terminé"}
												{item.status === "error" && "Erreur"}
											</p>
										</div>

										<button
											onClick={() => removeFile(item.id)}
											style={styles.secondaryButtonStyle}
											disabled={item.status === "uploading" || item.status === "done"}
										>
											Supprimer
										</button>
									</div>
								))}
							</div>
						)}

						<div style={styles.buttonRowStyle}>
							<button onClick={handleCloseModal} style={styles.secondaryButtonStyle}>
								{allDone ? "Fermer" : "Annuler"}
							</button>

							<button
								onClick={uploadAllFiles}
								style={styles.primaryButtonStyle}
								disabled={isUploading || files.length === 0}
							>
								{isUploading ? "Upload en cours..." : "Uploader"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

const styles = {
	buttonOpen: {
		width: "10vw",
		height: "4vh",
		backgroundColor: 'rgb(156, 138, 138)',
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		color: 'rgba(255, 255, 255, 0.9)',
		fontWeight: 500,
		letterSpacing: "1px"
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
		maxWidth: "700px",
		maxHeight: "85vh",
		overflowY: "auto"  as const,
		boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
	},
	dropzone: {
		border: "2px dashed #999",
		borderRadius: "12px",
		padding: "28px 20px",
		textAlign: "center" as const,
		cursor: "pointer",
		backgroundColor: "#fafafa",
		marginTop: "20px",
		marginBottom: "20px",
	},
	dropzoneActive: {
		borderColor: "#000",
		backgroundColor: "#f0f0f0",
	},
	filesContainer: {
		display: "flex",
		flexDirection: "column" as const,
		gap: "12px",
		marginBottom: "20px",
	},
	fileCard: {
		display: "flex",
		gap: "12px",
		border: "1px solid #ddd",
		borderRadius: "10px",
		padding: "12px",
		alignItems: "flex-start",
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
	},
};

export default FileUploader;