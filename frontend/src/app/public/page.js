"use strict";
// Home.tsx - Fixed version with debugging
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const feature_1 = __importDefault(require("@/component/feature"));
const content_1 = __importDefault(require("@/component/content"));
const started_1 = __importDefault(require("@/component/started"));
const footer_1 = __importDefault(require("@/component/footer"));
function Home() {
    return (<main>

    
      <content_1.default />
      <feature_1.default />
      <started_1.default />
      <footer_1.default />
    </main>);
}
