/**
 * Jayraj Fabrication — ISS Steel Section Data
 * All standard IS sizes for Angle, Beam, Channel, Pipe, Rec Tube, Sqr Tube, Bar/Flats
 */

export type AngleSection = { size: string; t: number; Ar: number; Cy: number; Ixx: number; Iu: number; Iv: number; R1: number; A: number; W: number };
export type BeamSection  = { size: string; bf: number; d: number; h: number; Iy: number; Iz: number; W: number; r: number; R: number; t: number; Ar: number; tw: number };
export type ChannelSection = { size: string; bf: number; Cy: number; h: number; Iy: number; Iz: number; W: number; r: number; R: number; t: number; Ar: number; tw: number };
export type PipeSection   = { size: string; OD: number; t: number; Wt: number; Ar: number; V: number; Se: number; Si: number; Ixx: number; Z: number; Rx: number };
export type RecTubeSection = { size: string; t: number; Wt: number; Ar: number; Ixx: number; Iyy: number; Rx: number; Ry: number; Zx: number; Zy: number; Sx: number; Sy: number };
export type SqrTubeSection = { size: string; D: number; t: number; Wt: number; Ar: number; Iy: number; Rx: number; Zy: number; Sx: number };
export type BarFlatRow    = { thk: number; roundArea: number; roundKgm: number; sqrArea: number; sqrKgm: number };

export const angleSections: AngleSection[] = [
  { size: "ISA 20×20×3",   t:3,  Ar:1.11, Cy:0.59, Ixx:0.4,   Iu:0.63, Iv:0.16, R1:3,  A:20,  W:0.87  },
  { size: "ISA 25×25×3",   t:3,  Ar:1.42, Cy:0.72, Ixx:0.8,   Iu:1.28, Iv:0.33, R1:3,  A:25,  W:1.11  },
  { size: "ISA 25×25×5",   t:5,  Ar:2.26, Cy:0.78, Ixx:1.19,  Iu:1.88, Iv:0.49, R1:5,  A:25,  W:1.77  },
  { size: "ISA 30×30×3",   t:3,  Ar:1.74, Cy:0.85, Ixx:1.4,   Iu:2.22, Iv:0.57, R1:4,  A:30,  W:1.36  },
  { size: "ISA 35×35×5",   t:5,  Ar:3.3,  Cy:1.0,  Ixx:3.5,   Iu:5.55, Iv:1.44, R1:5,  A:35,  W:2.6   },
  { size: "ISA 40×40×5",   t:5,  Ar:3.79, Cy:1.12, Ixx:5.4,   Iu:8.56, Iv:2.23, R1:5,  A:40,  W:2.97  },
  { size: "ISA 45×45×5",   t:5,  Ar:4.3,  Cy:1.25, Ixx:7.8,   Iu:12.4, Iv:3.23, R1:5,  A:45,  W:3.38  },
  { size: "ISA 50×50×5",   t:5,  Ar:4.8,  Cy:1.37, Ixx:11.1,  Iu:17.6, Iv:4.57, R1:6,  A:50,  W:3.77  },
  { size: "ISA 50×50×6",   t:6,  Ar:5.69, Cy:1.40, Ixx:12.9,  Iu:20.5, Iv:5.34, R1:6,  A:50,  W:4.47  },
  { size: "ISA 55×55×5",   t:5,  Ar:5.31, Cy:1.50, Ixx:14.8,  Iu:23.5, Iv:6.11, R1:6,  A:55,  W:4.17  },
  { size: "ISA 60×60×5",   t:5,  Ar:5.82, Cy:1.62, Ixx:19.4,  Iu:30.8, Iv:7.99, R1:7,  A:60,  W:4.57  },
  { size: "ISA 60×60×6",   t:6,  Ar:6.91, Cy:1.65, Ixx:22.8,  Iu:36.1, Iv:9.38, R1:7,  A:60,  W:5.42  },
  { size: "ISA 65×65×6",   t:6,  Ar:7.52, Cy:1.77, Ixx:29.0,  Iu:45.9, Iv:11.9, R1:7,  A:65,  W:5.90  },
  { size: "ISA 65×65×8",   t:8,  Ar:9.76, Cy:1.83, Ixx:37.0,  Iu:58.5, Iv:15.2, R1:9,  A:65,  W:7.66  },
  { size: "ISA 70×70×7",   t:7,  Ar:9.40, Cy:1.92, Ixx:40.8,  Iu:64.8, Iv:16.9, R1:8,  A:70,  W:7.38  },
  { size: "ISA 75×75×6",   t:6,  Ar:8.73, Cy:2.02, Ixx:45.0,  Iu:71.4, Iv:18.6, R1:8,  A:75,  W:6.85  },
  { size: "ISA 75×75×8",   t:8,  Ar:11.4, Cy:2.07, Ixx:57.8,  Iu:91.7, Iv:23.8, R1:10, A:75,  W:8.97  },
  { size: "ISA 80×80×8",   t:8,  Ar:12.3, Cy:2.19, Ixx:71.0,  Iu:113,  Iv:29.3, R1:10, A:80,  W:9.64  },
  { size: "ISA 90×90×8",   t:8,  Ar:13.9, Cy:2.44, Ixx:102,   Iu:162,  Iv:42.2, R1:10, A:90,  W:10.9  },
  { size: "ISA 100×100×8", t:8,  Ar:15.5, Cy:2.68, Ixx:141,   Iu:224,  Iv:58.4, R1:12, A:100, W:12.2  },
  { size: "ISA 100×100×10",t:10, Ar:19.2, Cy:2.74, Ixx:173,   Iu:274,  Iv:71.2, R1:12, A:100, W:15.1  },
  { size: "ISA 110×110×10",t:10, Ar:21.2, Cy:2.99, Ixx:231,   Iu:367,  Iv:95.3, R1:12, A:110, W:16.6  },
  { size: "ISA 130×130×12",t:12, Ar:29.8, Cy:3.58, Ixx:471,   Iu:747,  Iv:195,  R1:14, A:130, W:23.4  },
  { size: "ISA 150×150×12",t:12, Ar:34.8, Cy:4.09, Ixx:727,   Iu:1154, Iv:300,  R1:16, A:150, W:27.3  },
];

export const beamSections: BeamSection[] = [
  { size: "ISMB 100", bf:50,  d:65,  h:100,  Iy:40.8,   Iz:257.5,   W:11.5,  r:4.5, R:9,   t:7.2,  Ar:14.6, tw:4   },
  { size: "ISMB 125", bf:70,  d:80,  h:125,  Iy:111,    Iz:620,     W:13.3,  r:5,   R:10,  t:8.1,  Ar:16.9, tw:5.1 },
  { size: "ISMB 150", bf:75,  d:95,  h:150,  Iy:150,    Iz:912,     W:14.9,  r:5,   R:10,  t:8.0,  Ar:19.0, tw:5.4 },
  { size: "ISMB 175", bf:85,  d:110, h:175,  Iy:252,    Iz:1528,    W:19.1,  r:5.5, R:11,  t:8.5,  Ar:24.3, tw:5.8 },
  { size: "ISMB 200", bf:100, d:130, h:200,  Iy:469,    Iz:2235,    W:25.4,  r:6,   R:12,  t:10.8, Ar:32.3, tw:5.7 },
  { size: "ISMB 225", bf:110, d:145, h:225,  Iy:718,    Iz:3441,    W:31.1,  r:6.5, R:13,  t:11.8, Ar:39.7, tw:6.5 },
  { size: "ISMB 250", bf:125, d:165, h:250,  Iy:1244,   Iz:5131,    W:37.3,  r:7,   R:14,  t:12.5, Ar:47.5, tw:6.9 },
  { size: "ISMB 300", bf:140, d:195, h:300,  Iy:2193,   Iz:8609,    W:46.1,  r:8,   R:16,  t:13.1, Ar:58.8, tw:7.5 },
  { size: "ISMB 350", bf:140, d:225, h:350,  Iy:2158,   Iz:13630,   W:52.4,  r:8.5, R:17,  t:14.2, Ar:66.7, tw:8.1 },
  { size: "ISMB 400", bf:140, d:250, h:400,  Iy:2163,   Iz:20458,   W:61.6,  r:9,   R:18,  t:16.0, Ar:78.4, tw:8.9 },
  { size: "ISMB 450", bf:150, d:280, h:450,  Iy:2989,   Iz:30391,   W:72.4,  r:9.5, R:19,  t:17.4, Ar:92.3, tw:9.4 },
  { size: "ISMB 500", bf:180, d:320, h:500,  Iy:7740,   Iz:45218,   W:86.9,  r:10,  R:20,  t:17.2, Ar:110,  tw:10.2 },
  { size: "ISMB 550", bf:190, d:355, h:550,  Iy:9344,   Iz:64894,   W:103.7, r:11,  R:22,  t:19.3, Ar:132,  tw:11.2 },
  { size: "ISMB 600", bf:210, d:395, h:600,  Iy:15521,  Iz:91813,   W:122.6, r:12,  R:24,  t:20.8, Ar:156,  tw:12   },
];

export const channelSections: ChannelSection[] = [
  { size: "ISMC 75",  bf:40,  Cy:1.32, h:75,  Iy:12.6,  Iz:76,    W:6.8,  r:4.5, R:8.5, t:7.3,  Ar:8.67,  tw:4.4 },
  { size: "ISMC 100", bf:50,  Cy:1.52, h:100, Iy:26.5,  Iz:186.6, W:9.56, r:5,   R:9,   t:7.7,  Ar:12.2,  tw:4.7 },
  { size: "ISMC 125", bf:65,  Cy:1.95, h:125, Iy:83.6,  Iz:416.4, W:13.1, r:5.5, R:10,  t:8.4,  Ar:16.7,  tw:5.3 },
  { size: "ISMC 150", bf:75,  Cy:2.21, h:150, Iy:145,   Iz:788.1, W:16.4, r:6,   R:11,  t:9.0,  Ar:20.9,  tw:5.7 },
  { size: "ISMC 175", bf:75,  Cy:2.05, h:175, Iy:135,   Iz:1217,  W:19.1, r:6.5, R:12,  t:10.2, Ar:24.4,  tw:5.7 },
  { size: "ISMC 200", bf:75,  Cy:1.97, h:200, Iy:140,   Iz:1819,  W:22.1, r:7,   R:14,  t:11.4, Ar:28.2,  tw:6.1 },
  { size: "ISMC 225", bf:80,  Cy:2.09, h:225, Iy:174,   Iz:2694,  W:26.1, r:7.5, R:15,  t:12.4, Ar:33.2,  tw:6.4 },
  { size: "ISMC 250", bf:82,  Cy:2.12, h:250, Iy:197,   Iz:3819,  W:30.4, r:8,   R:16,  t:14.1, Ar:38.7,  tw:7.2 },
  { size: "ISMC 300", bf:90,  Cy:2.31, h:300, Iy:310,   Iz:6362,  W:36.3, r:9,   R:18,  t:13.6, Ar:46.3,  tw:7.6 },
  { size: "ISMC 350", bf:100, Cy:2.62, h:350, Iy:571,   Iz:10009, W:42.1, r:10,  R:20,  t:13.5, Ar:53.7,  tw:8.1 },
  { size: "ISMC 400", bf:100, Cy:2.54, h:400, Iy:551,   Iz:15082, W:49.4, r:11,  R:22,  t:15.3, Ar:63.0,  tw:8.6 },
];

export const pipeSections: PipeSection[] = [
  { size: "15mm Light",   OD:21.3, t:2.0, Wt:0.947, Ar:1.21, V:235,  Se:669,  Si:543,  Ixx:0.57,  Z:0.54,  Rx:0.69 },
  { size: "15mm Medium",  OD:21.3, t:2.6, Wt:1.21,  Ar:1.54, V:184,  Se:669,  Si:433,  Ixx:0.69,  Z:0.65,  Rx:0.67 },
  { size: "20mm Light",   OD:26.7, t:2.3, Wt:1.39,  Ar:1.77, V:373,  Se:838,  Si:693,  Ixx:1.44,  Z:1.08,  Rx:0.90 },
  { size: "20mm Medium",  OD:26.7, t:2.6, Wt:1.56,  Ar:1.99, V:327,  Se:838,  Si:607,  Ixx:1.59,  Z:1.19,  Rx:0.89 },
  { size: "25mm Light",   OD:33.4, t:2.6, Wt:2.00,  Ar:2.55, V:622,  Se:1049, Si:878,  Ixx:3.25,  Z:1.95,  Rx:1.13 },
  { size: "25mm Medium",  OD:33.4, t:3.2, Wt:2.41,  Ar:3.07, V:546,  Se:1049, Si:761,  Ixx:3.80,  Z:2.28,  Rx:1.11 },
  { size: "32mm Light",   OD:42.2, t:2.6, Wt:2.55,  Ar:3.25, V:1039, Se:1325, Si:1118, Ixx:6.66,  Z:3.16,  Rx:1.43 },
  { size: "32mm Medium",  OD:42.2, t:3.2, Wt:3.10,  Ar:3.95, V:926,  Se:1325, Si:985,  Ixx:7.93,  Z:3.76,  Rx:1.42 },
  { size: "40mm Light",   OD:48.3, t:2.9, Wt:3.24,  Ar:4.12, V:1499, Se:1517, Si:1290, Ixx:11.6,  Z:4.80,  Rx:1.68 },
  { size: "40mm Medium",  OD:48.3, t:3.2, Wt:3.56,  Ar:4.53, V:1436, Se:1517, Si:1231, Ixx:12.6,  Z:5.21,  Rx:1.67 },
  { size: "50mm Light",   OD:60.3, t:2.9, Wt:4.11,  Ar:5.23, V:2499, Se:1894, Si:1631, Ixx:23.5,  Z:7.80,  Rx:2.12 },
  { size: "50mm Medium",  OD:60.3, t:3.6, Wt:5.03,  Ar:6.41, V:2295, Se:1894, Si:1484, Ixx:28.3,  Z:9.38,  Rx:2.10 },
  { size: "65mm Light",   OD:76.1, t:3.2, Wt:5.71,  Ar:7.27, V:3989, Se:2391, Si:2073, Ixx:59.9,  Z:15.7,  Rx:2.87 },
  { size: "80mm Medium",  OD:88.9, t:4.0, Wt:8.36,  Ar:10.6, V:5523, Se:2793, Si:2382, Ixx:108,   Z:24.3,  Rx:3.19 },
  { size: "100mm Medium", OD:114.3,t:4.5, Wt:12.2,  Ar:15.5, V:9424, Se:3590, Si:3077, Ixx:248,   Z:43.4,  Rx:4.00 },
];

export const recTubeSections: RecTubeSection[] = [
  { size: "50×25×2.0",   t:2.0, Wt:2.15,  Ar:2.737,  Ixx:8.38,  Iyy:2.8,   Rx:1.75, Ry:1.01, Zx:3.35, Zy:2.24, Sx:4.26, Sy:2.616 },
  { size: "50×25×2.5",   t:2.5, Wt:2.64,  Ar:3.36,   Ixx:9.94,  Iyy:3.28,  Rx:1.72, Ry:0.99, Zx:3.98, Zy:2.62, Sx:5.01, Sy:3.04  },
  { size: "50×30×2.0",   t:2.0, Wt:2.32,  Ar:2.958,  Ixx:9.63,  Iyy:4.0,   Rx:1.80, Ry:1.16, Zx:3.85, Zy:2.67, Sx:4.85, Sy:3.12  },
  { size: "60×40×2.0",   t:2.0, Wt:2.96,  Ar:3.77,   Ixx:20.0,  Iyy:9.44,  Rx:2.30, Ry:1.58, Zx:6.67, Zy:4.72, Sx:8.27, Sy:5.52  },
  { size: "75×50×3.0",   t:3.0, Wt:5.54,  Ar:7.06,   Ixx:56.7,  Iyy:26.8,  Rx:2.83, Ry:1.95, Zx:15.1, Zy:10.7, Sx:18.8, Sy:13.0  },
  { size: "100×50×3.0",  t:3.0, Wt:6.71,  Ar:8.55,   Ixx:119,   Iyy:32.8,  Rx:3.73, Ry:1.96, Zx:23.8, Zy:13.1, Sx:29.7, Sy:15.5  },
  { size: "100×60×4.0",  t:4.0, Wt:10.0,  Ar:12.7,   Ixx:178,   Iyy:67.2,  Rx:3.74, Ry:2.30, Zx:35.6, Zy:22.4, Sx:44.3, Sy:27.0  },
  { size: "120×60×4.0",  t:4.0, Wt:11.3,  Ar:14.4,   Ixx:282,   Iyy:80.6,  Rx:4.43, Ry:2.37, Zx:47.0, Zy:26.9, Sx:58.6, Sy:32.1  },
  { size: "150×75×5.0",  t:5.0, Wt:17.5,  Ar:22.3,   Ixx:656,   Iyy:195,   Rx:5.42, Ry:2.96, Zx:87.5, Zy:52.0, Sx:109,  Sy:61.8  },
  { size: "200×100×6.0", t:6.0, Wt:28.7,  Ar:36.5,   Ixx:2205,  Iyy:557,   Rx:7.77, Ry:3.91, Zx:220,  Zy:111,  Sx:274,  Sy:132   },
];

export const sqrTubeSections: SqrTubeSection[] = [
  { size: "20×20×2.0",  D:20,  t:2.0, Wt:1.08, Ar:1.37, Iy:0.60,  Rx:0.66, Zy:0.60,  Sx:0.74  },
  { size: "25×25×2.0",  D:25,  t:2.0, Wt:1.38, Ar:1.76, Iy:1.25,  Rx:0.84, Zy:1.00,  Sx:1.25  },
  { size: "25×25×2.6",  D:25,  t:2.6, Wt:1.69, Ar:2.16, Iy:1.72,  Rx:0.89, Zy:1.38,  Sx:1.76  },
  { size: "30×30×2.0",  D:30,  t:2.0, Wt:1.68, Ar:2.14, Iy:2.51,  Rx:1.08, Zy:1.67,  Sx:2.09  },
  { size: "40×40×3.0",  D:40,  t:3.0, Wt:3.26, Ar:4.16, Iy:9.39,  Rx:1.50, Zy:4.70,  Sx:5.98  },
  { size: "50×50×3.0",  D:50,  t:3.0, Wt:4.14, Ar:5.27, Iy:20.5,  Rx:1.97, Zy:8.20,  Sx:10.4  },
  { size: "50×50×4.0",  D:50,  t:4.0, Wt:5.33, Ar:6.79, Iy:25.4,  Rx:1.93, Zy:10.2,  Sx:12.9  },
  { size: "60×60×4.0",  D:60,  t:4.0, Wt:6.56, Ar:8.35, Iy:52.7,  Rx:2.51, Zy:17.6,  Sx:22.3  },
  { size: "75×75×4.0",  D:75,  t:4.0, Wt:8.31, Ar:10.6, Iy:120,   Rx:3.37, Zy:32.0,  Sx:40.2  },
  { size: "100×100×5.0",D:100, t:5.0, Wt:14.8, Ar:18.8, Iy:434,   Rx:4.81, Zy:86.8,  Sx:108   },
  { size: "150×150×6.0",D:150, t:6.0, Wt:26.6, Ar:33.8, Iy:2182,  Rx:8.03, Zy:291,   Sx:362   },
];

export const barFlatData: BarFlatRow[] = [
  { thk:5,  roundArea:0.196, roundKgm:0.154, sqrArea:0.250,  sqrKgm:0.196  },
  { thk:6,  roundArea:0.283, roundKgm:0.222, sqrArea:0.360,  sqrKgm:0.283  },
  { thk:8,  roundArea:0.503, roundKgm:0.395, sqrArea:0.640,  sqrKgm:0.502  },
  { thk:10, roundArea:0.785, roundKgm:0.617, sqrArea:1.000,  sqrKgm:0.785  },
  { thk:12, roundArea:1.130, roundKgm:0.888, sqrArea:1.440,  sqrKgm:1.130  },
  { thk:14, roundArea:1.540, roundKgm:1.210, sqrArea:1.960,  sqrKgm:1.540  },
  { thk:16, roundArea:2.010, roundKgm:1.580, sqrArea:2.560,  sqrKgm:2.010  },
  { thk:18, roundArea:2.540, roundKgm:2.000, sqrArea:3.240,  sqrKgm:2.540  },
  { thk:20, roundArea:3.140, roundKgm:2.470, sqrArea:4.000,  sqrKgm:3.140  },
  { thk:22, roundArea:3.800, roundKgm:2.980, sqrArea:4.840,  sqrKgm:3.800  },
  { thk:25, roundArea:4.910, roundKgm:3.850, sqrArea:6.250,  sqrKgm:4.910  },
  { thk:28, roundArea:6.160, roundKgm:4.830, sqrArea:7.840,  sqrKgm:6.160  },
  { thk:30, roundArea:7.070, roundKgm:5.550, sqrArea:9.000,  sqrKgm:7.060  },
  { thk:32, roundArea:8.040, roundKgm:6.310, sqrArea:10.240, sqrKgm:8.040  },
];
