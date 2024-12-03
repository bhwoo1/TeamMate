import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve("public/uploads");

export async function POST(req: Request) {
    try {
      console.log("요청을 받았습니다.");
      const formData = await req.formData();
      const body = Object.fromEntries(formData);
      const file = body.file as Blob;
  
      if (!file) {
        console.log("파일을 찾을 수 없습니다.");
        return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
      }
  
      const buffer = Buffer.from(await file.arrayBuffer());
  
      if (!fs.existsSync(UPLOAD_DIR)) {
        console.log("업로드 디렉터리가 존재하지 않습니다. 생성합니다.");
        fs.mkdirSync(UPLOAD_DIR, { recursive: true }); // 디렉터리 생성
      }
  
      const fileName = Date.now() + path.extname((file as File).name);
      const filePath = path.resolve(UPLOAD_DIR, fileName);
      console.log("파일 경로:", filePath); // 경로 확인
  
      fs.writeFileSync(filePath, buffer); // 파일 저장
  
      const fileUrl = `/uploads/${fileName}`; // 반환할 URL
  
      return NextResponse.json({ url: fileUrl });
  
    } catch (err) {
      console.error("파일 업로드 실패:", err);
      return NextResponse.json({ error: "파일 업로드 실패" }, { status: 500 });
    }
  }