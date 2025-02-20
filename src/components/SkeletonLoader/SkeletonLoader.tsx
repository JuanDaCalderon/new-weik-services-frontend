import {memo} from 'react';
import {SkeletonLoaderProps} from '@/types';
import './SkeletonLoader.scss';

const SkeletonLoader = memo(function SkeletonLoader({customClass, width, height}: SkeletonLoaderProps) {
  return (
    <div
      style={{width: width ? width : '100%', height: height ? height : '100%'}}
      className={`skeleton-container ${customClass ? customClass : ''}`}>
      <div className="skeleton-loader"></div>
    </div>
  );
});

export {SkeletonLoader};
