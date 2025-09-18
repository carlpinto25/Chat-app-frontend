import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";

type ExportFormat = "pdf" | "txt" | "csv";
type ExportScope = "current" | "all";

export interface ExportableMessage {
  id: number;
  text: string;
  sender: string;
  dateTime: string;
}

interface ExportChatProps {
  currentMessages: ExportableMessage[];
  fullHistory?: ExportableMessage[];
  chatTitle?: string;
}

const ExportChat: React.FC<ExportChatProps> = ({
  currentMessages,
  fullHistory,
  chatTitle = "Chat",
}) => {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [scope, setScope] = useState<ExportScope>("current");

  const messagesToExport = useMemo(() => {
    if (scope === "all") {
      return fullHistory && fullHistory.length > 0
        ? fullHistory
        : currentMessages;
    }

    return currentMessages;
  }, [currentMessages, fullHistory, scope]);

  const normalizeMessages = () =>
    messagesToExport.map((message) => ({
      ...message,
      formattedTimestamp: dayjs(message.dateTime).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    }));

  const buildFileName = () => {
    const timestamp = dayjs().format("YYYYMMDD-HHmmss");
    const scopeSuffix = scope === "current" ? "current" : "history";
    return `${chatTitle.replace(/\s+/g, "-").toLowerCase()}-${scopeSuffix}-${timestamp}.${format}`;
  };

  const triggerDownload = (content: BlobPart, mimeType: string) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = buildFileName();
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsTxt = () => {
    const lines = normalizeMessages().map(
      (message) =>
        `[${message.formattedTimestamp}] ${message.sender}: ${message.text}`
    );
    triggerDownload(lines.join("\n"), "text/plain");
  };

  const exportAsCsv = () => {
    const header = "Timestamp,Sender,Message";
    const rows = normalizeMessages().map((message) => {
      const escapeCsv = (value: string) => {
        const sanitized = value.replace(/"/g, '""').replace(/\n/g, " ");
        return `"${sanitized}"`;
      };
      const timestamp = escapeCsv(message.formattedTimestamp);
      const sender = escapeCsv(message.sender);
      const text = escapeCsv(message.text);

      return `${timestamp},${sender},${text}`;
    });

    triggerDownload([header, ...rows].join("\n"), "text/csv");
  };

  const exportAsPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let cursorY = margin;

    doc.setFontSize(16);
    doc.text(`${chatTitle} export`, margin, cursorY);
    cursorY += 10;
    doc.setFontSize(11);
    doc.text(`Scope: ${scope === "current" ? "Current chat" : "Entire history"}`, margin, cursorY);
    cursorY += 10;
    doc.text(`Generated: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`, margin, cursorY);
    cursorY += 15;

    const normalized = normalizeMessages();
    doc.setFontSize(11);

    const lineHeight = 7;
    const maxWidth = pageWidth - margin * 2;

    normalized.forEach((message) => {
      const entry = `[${message.formattedTimestamp}] ${message.sender}: ${message.text}`;
      const lines = doc.splitTextToSize(entry, maxWidth);

      lines.forEach((line: string) => {
        if (cursorY > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }

        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });

      cursorY += lineHeight / 2;
    });

    doc.save(buildFileName());
  };

  const handleExport = () => {
    if (messagesToExport.length === 0) {
      return;
    }

    if (format === "pdf") {
      exportAsPdf();
    } else if (format === "txt") {
      exportAsTxt();
    } else {
      exportAsCsv();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={scope}
        onChange={(event) => setScope(event.target.value as ExportScope)}
        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white dark:bg-[#1B1B1F] dark:border-gray-600"
        aria-label="Choose export scope"
      >
        <option value="current">Current chat</option>
        <option value="all">Entire history</option>
      </select>
      <select
        value={format}
        onChange={(event) => setFormat(event.target.value as ExportFormat)}
        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white dark:bg-[#1B1B1F] dark:border-gray-600"
        aria-label="Choose export format"
      >
        <option value="pdf">PDF</option>
        <option value="txt">TXT</option>
        <option value="csv">CSV</option>
      </select>
      <button
        type="button"
        onClick={handleExport}
        disabled={messagesToExport.length === 0}
        className="bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Export
      </button>
    </div>
  );
};

export default ExportChat;