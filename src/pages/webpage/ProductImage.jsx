// src/components/common/ProductImage.jsx
import React from "react";

/**
 * 대표이미지 후보들을 순차 시도하고, 모두 실패하면 fallback을 쓰는 이미지 컴포넌트.
 * - 후보 우선순위: thumbnail → image → images[0..] → fallback
 * - 상대경로를 절대 URL로 보정 (Vite/CRA 환경변수 지원)
 * - 혼합콘텐츠/경로 문제로 인한 조기 실패를 줄임
 *
 * 사용:
 *  <ProductImage item={item} alt={item.title} className="wish-product-image" />
 */

// 환경변수에서 API 베이스 URL 읽기 (Vite/CRA 둘 다 지원)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
  "";

// 문자열/객체 섞여 있어도 URL만 추출
function pickUrl(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  // 흔한 필드 이름들 지원
  return v.url || v.src || v.path || "";
}

// 상대경로를 절대경로로 보정
function toAbsolute(u) {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u; // 이미 절대 URL
  const base = (API_BASE || "").replace(/\/+$/, ""); // 끝 슬래시 제거
  const path = String(u).replace(/^\/+/, "");        // 앞 슬래시 제거
  return base ? `${base}/${path}` : `/${path}`;      // 최소 루트 기준
}

// 중복 제거 + falsy 제거
function dedupe(list) {
  return [...new Set(list.filter(Boolean))];
}

export default function ProductImage({
  item,
  alt = "상품 이미지",
  className,
  style,
  fallbackSrc = "/images/sample-product.jpg",
  loading = "lazy",
  fit = "cover", // object-fit
  referrerPolicy = "no-referrer",
  ...imgProps
}) {
  const candidates = React.useMemo(() => {
    const list = [
      pickUrl(item?.thumbnail),
      pickUrl(item?.image),
      ...(Array.isArray(item?.images) ? item.images.map(pickUrl) : []),
      fallbackSrc,
    ];
    return dedupe(list).map(toAbsolute);
  }, [item, fallbackSrc]);

  const [idx, setIdx] = React.useState(0);

  const handleError = () => {
    setIdx((prev) => (prev < candidates.length - 1 ? prev + 1 : prev));
  };

  return (
    <img
      src={candidates[idx]}
      alt={alt}
      loading={loading}
      referrerPolicy={referrerPolicy}
      onError={handleError}
      className={className}
      style={{
        objectFit: fit,
        width: "100%",
        height: "100%",
        display: "block",
        ...style,
      }}
      {...imgProps}
    />
  );
}
