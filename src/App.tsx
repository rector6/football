import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, Trophy, Newspaper, ShoppingBag, Info, Megaphone, Mail,
  Plus, X, ShoppingCart, Trash2, ChevronRight, Clock, ArrowLeft,
  Menu, Users, MessageCircle, Mic, Play, Minus, Check,
} from 'lucide-react';
import {
  PageId, PRODUCTS, NEWS, CREST_COLORS,
  AD_PACKAGES, PODCASTS, FOOTER_LINKS, Product, NewsArticle,
  ScheduledMatch, LiveMatch,
} from './data';
import { fetchScoresBundle } from './api/football';

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.2 } };

function Crest({ name }: { name: string }) {
  const color = CREST_COLORS[name.charCodeAt(0) % CREST_COLORS.length];
  return <div className={`h-7 w-7 ${color} rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0`}>{name.slice(0, 2).toUpperCase()}</div>;
}
function LiveDot() {
  return <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-live" />;
}
