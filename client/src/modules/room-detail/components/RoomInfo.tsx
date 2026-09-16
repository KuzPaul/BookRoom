import {
  PenIcon,
  TvIcon,
  UsersIcon,
  VideoIcon,
} from "../../../shared/ui/icons";
import type { RoomFeature, RoomSummary } from "../../../shared/api/types";
import { formatOfficeAddress } from "../../../shared/lib/date";
import styles from "./RoomInfo.module.css";

const FEATURE_ORDER = ["display", "whiteboard", "video"] as const;

const FEATURE_ICONS = {
  display: TvIcon,
  whiteboard: PenIcon,
  video: VideoIcon,
} as const;

function sortFeatures(features: RoomFeature[]): RoomFeature[] {
  return [...features].sort((left, right) => {
    const leftIndex = FEATURE_ORDER.indexOf(left.code as (typeof FEATURE_ORDER)[number]);
    const rightIndex = FEATURE_ORDER.indexOf(right.code as (typeof FEATURE_ORDER)[number]);
    const safeLeft = leftIndex === -1 ? FEATURE_ORDER.length : leftIndex;
    const safeRight = rightIndex === -1 ? FEATURE_ORDER.length : rightIndex;
    return safeLeft - safeRight;
  });
}

type RoomInfoProps = {
  room: RoomSummary;
};

export function RoomInfo({ room }: RoomInfoProps) {
  const features = sortFeatures(room.features ?? []);

  return (
    <aside className={styles.panel}>
      <h1 className={styles.title}>{room.name}</h1>
      <p className={styles.subtitle}>
        {room.office.name} · {formatOfficeAddress(room.office.address)}
      </p>
      <div className={styles.divider} aria-hidden />
      <div className={styles.row}>
        <span className={styles.iconWrap}>
          <UsersIcon className={styles.icon} aria-hidden />
        </span>
        <span>Вместимость: до {room.capacity} человек</span>
      </div>
      {features.map((feature) => {
        const FeatureIcon = FEATURE_ICONS[feature.code as keyof typeof FEATURE_ICONS] ?? PenIcon;

        return (
          <div key={feature.code} className={styles.row}>
            <span className={styles.iconWrap}>
              <FeatureIcon className={styles.icon} aria-hidden />
            </span>
            <span>{feature.name}</span>
          </div>
        );
      })}
    </aside>
  );
}
