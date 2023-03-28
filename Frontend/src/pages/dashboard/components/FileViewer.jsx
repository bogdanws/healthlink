// import { Document, Page } from "react-pdf";
import { useState } from "react";

export default function FileViewer({ fileURL, fileType }) {
	if (!fileURL) return null;

	// const [numPages, setNumPages] = useState(null);
	// const [pageNumber, setPageNumber] = useState(1);

	if (fileType === "image") {
		return <img src={fileURL} alt="Patient document" />;
	} else if (fileType === "pdf") {
		// full path to file
		return (
			/* 			<Document
				file={fileURL}
				onLoadSuccess={({ numPages }) => {
					console.log(numPages);
					setNumPages(numPages);
				}}
				options={{
					cMapUrl: "cmaps/",
					cMapPacked: true
				}}
			>
				<Page pageNumber={pageNumber} />
			</Document> */
			<a href={fileURL} target="_blank" rel="noreferrer">
				View PDF
			</a>
		);
	} else {
		return (
			<div>
				<p>File type not supported</p>
			</div>
		);
	}
}
