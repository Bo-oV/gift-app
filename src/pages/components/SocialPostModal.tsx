import { Button } from "@/components/Button/Button";
import { RefreshCw } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./socialPostModal.scss";

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;
const PREVIEW_WIDTH = 236;
const PREVIEW_HEIGHT = 420;
const QR_SIZE = 196;

const templateModules = import.meta.glob(
  "../../assets/story-templates/instagram/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
);

const storyTemplates = Object.entries(templateModules)
  .sort(([leftPath], [rightPath]) =>
    leftPath.localeCompare(rightPath, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  )
  .map(([, module]) => module as string);

type Props = {
  title: string;
  userName: string;
  dateLabel: string;
  link: string;
  onClose: () => void;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    image.src = src;
  });

const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) => {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [""];
  }

  const lines: string[] = [];
  let currentLine = words[0];

  for (const word of words.slice(1)) {
    const nextLine = `${currentLine} ${word}`;

    if (context.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  lines.push(currentLine);

  return lines.slice(0, 3);
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, "-")
    .replace(/^-+|-+$/g, "");

export const SocialPostModal = ({
  title,
  userName,
  dateLabel,
  link,
  onClose,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrCanvasId = useId().replace(/:/g, "_");
  const [templateIndex, setTemplateIndex] = useState(0);

  const activeTemplate = storyTemplates[templateIndex] ?? null;
  const fileName = slugify(title) || "social-story";

  const previewHint = useMemo(
    () =>
      storyTemplates.length === 0
        ? "Додайте шаблони у src/assets/story-templates/instagram/"
        : null,
    [],
  );

  useEffect(() => {
    const drawStory = async () => {
      const canvas = canvasRef.current;
      const qrCanvas = document.getElementById(qrCanvasId) as
        | HTMLCanvasElement
        | null;

      if (!canvas || !qrCanvas) {
        return;
      }

      canvas.width = STORY_WIDTH;
      canvas.height = STORY_HEIGHT;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.clearRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

      if (activeTemplate) {
        try {
          const template = await loadImage(activeTemplate);
          context.drawImage(template, 0, 0, STORY_WIDTH, STORY_HEIGHT);
        } catch {
          context.fillStyle = "#fafbff";
          context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
        }
      } else {
        context.fillStyle = "#fafbff";
        context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

        const gradient = context.createRadialGradient(
          STORY_WIDTH * 0.78,
          STORY_HEIGHT * 0.86,
          80,
          STORY_WIDTH * 0.78,
          STORY_HEIGHT * 0.86,
          620,
        );
        gradient.addColorStop(0, "rgba(255, 107, 156, 0.20)");
        gradient.addColorStop(1, "rgba(255, 107, 156, 0)");

        context.fillStyle = gradient;
        context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
      }

      context.fillStyle = "#2f3342";
      context.textAlign = "center";
      context.textBaseline = "top";
      context.font = "700 70px 'Segoe UI', sans-serif";

      const titleLines = wrapText(context, title, 760);
      const titleStartY = 220;
      const titleLineHeight = 82;

      titleLines.forEach((line, index) => {
        context.fillText(
          line,
          STORY_WIDTH / 2,
          titleStartY + index * titleLineHeight,
        );
      });

      context.fillStyle = "#9aa0af";
      context.font = "500 40px 'Segoe UI', sans-serif";
      context.fillText(
        userName,
        STORY_WIDTH / 2,
        titleStartY + titleLines.length * titleLineHeight + 10,
      );

      context.fillStyle = "#2f3342";
      context.textAlign = "right";
      context.font = "700 48px 'Segoe UI', sans-serif";
      context.fillText(dateLabel, STORY_WIDTH - 104, 470);

      context.textAlign = "left";
      context.drawImage(
        qrCanvas,
        (STORY_WIDTH - QR_SIZE) / 2,
        STORY_HEIGHT - 340,
        QR_SIZE,
        QR_SIZE,
      );
    };

    void drawStory();
  }, [activeTemplate, dateLabel, qrCanvasId, title, userName]);

  const handleRegenerate = () => {
    if (storyTemplates.length <= 1) {
      return;
    }

    setTemplateIndex((currentIndex) => (currentIndex + 1) % storyTemplates.length);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const url = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${fileName}-story.png`;
    anchor.click();
  };

  return (
    <div className="social-post-modal">
      <div className="social-post-modal__backdrop" onClick={onClose} />

      <div className="social-post-modal__content">
        <div className="social-post-modal__header">
          <h3 className="social-post-modal__title">Фото</h3>

          <button
            className="social-post-modal__regenerate"
            type="button"
            onClick={handleRegenerate}
            aria-label="Перегенерувати фото"
            disabled={storyTemplates.length <= 1}
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="social-post-modal__preview">
          <canvas
            ref={canvasRef}
            style={{
              width: `${PREVIEW_WIDTH}px`,
              height: `${PREVIEW_HEIGHT}px`,
            }}
          />
        </div>

        {previewHint && (
          <p className="social-post-modal__hint">{previewHint}</p>
        )}

        <div className="social-post-modal__actions">
          <Button text="Закрити" variant="ghost" onClick={onClose} />
          <Button text="Завантажити фото" onClick={handleDownload} />
        </div>

        <div className="social-post-modal__hidden-qr" aria-hidden="true">
          <QRCodeCanvas id={qrCanvasId} value={link} size={512} includeMargin />
        </div>
      </div>
    </div>
  );
};
