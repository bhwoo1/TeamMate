"use client"

import { areas, Team } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";

const initialTeam: Team = {
    teamName: "",
    teamLogo: "",
    location: "",
    description: ""
}


const submitTeam = async ({team, user} : {team: Team, user: string}) => {
    console.log(team);

    await axios.post("/api/team/create", {
        teamName: team.teamName,
        description: team.description,
        location: team.location,
        teamLogo: team.teamLogo
    }, {
        headers: {
            requestUser: user
        }
    });
}

const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
  
    const response = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  
  
    if (response.status !== 200) {
      throw new Error("파일 업로드 실패");
    }
  
  
    return response.data; // 업로드된 파일의 URL이나 데이터 반환
  
  }

const TeamCreateClient = () => {
    const [newTeam, setNewTeam] = useState<Team>(initialTeam);
    const {data: session} = useSession();
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [selectedSubArea, setSelectedSubArea] = useState<string>('');

    const submitTeamMutation = useMutation(submitTeam, {
        onSuccess: () => {
            alert('등록되었습니다.');
        },
        onError: (error: AxiosError) => {
            console.error("Submit request failed:", error.response?.data || error.message);
        }
    });

    const uploadMutation = useMutation(uploadFile, {
        onError: (error: AxiosError) => {
          console.error("파일 업로드 실패:", error.response?.data || error.message);
        },
      });

    const handleSubmit = async ({e, newTeam} : {e: FormEvent; newTeam: Team}) => {
        e.preventDefault();

        console.log(newTeam);

        // 파일이 존재하고 File 객체인 경우, 파일 업로드를 먼저 진행
        if (newTeam.teamLogo && newTeam.teamLogo instanceof File) {
            try {
                // 파일 업로드 후 URL을 얻은 후, 선수 등록을 진행
                const fileData = await uploadMutation.mutateAsync(newTeam.teamLogo);
                
                // 업로드된 파일의 URL을 player 상태에 반영
                setNewTeam((prev) => ({
                    ...prev,
                    teamLogo: fileData.url, // 파일 URL로 상태 업데이트
                }));

                console.log("등록 실행");

                console.log(session);


            
                // 파일 업로드 후, 팀 등록을 실행
                if (session?.user?.email) {
                    submitTeamMutation.mutate({ team: { ...newTeam, teamLogo: fileData.url }, user: String(session.user.email) });
                }
            } catch (error) {
                console.error("파일 업로드 실패:", error);
                alert("파일 업로드에 실패했습니다. 다시 시도해 주세요.");
            }
        } else {
            // 파일이 없다면 등록 불가 알림
            alert("파일을 업로드해야 합니다.");
        }
    }

    const handleAreaChange = (area: string) => {
        setSelectedArea(area);
        setSelectedSubArea(''); // 지역이 바뀔 때 기초자치단체 초기화
    };

    const handleSubAreaChange = (subArea: string) => {
        setSelectedSubArea(subArea);
        setNewTeam({...newTeam, location: `${selectedArea} ${selectedSubArea}`});
    };


    return(
        <form
            onSubmit={(e) => handleSubmit({e, newTeam})}
        >
            {/* 이름 입력 */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    팀 이름
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={newTeam.teamName}
                    onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
                    className="mt-1 p-2 border w-full rounded"
                    placeholder="팀 이름을 입력하세요."
                />
            </div>

            {/* 팀 로고 업로드 */}
            <input
                type="file"
                id="teamLogo"
                name="teamLogo"
                onChange={(e) => {
                    const file = e.target.files?.[0]; // 첫 번째 파일 객체 가져오기
                    if (file) {
                      setNewTeam({ ...newTeam, teamLogo: file }); // 상태에 File 객체 저장
                      console.log("선택된 파일:", file);
                    }
                  }}
                className="mt-1 p-2 border w-full rounded"
            />

            {/* 팀 설명 입력 */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    팀 설명
                </label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    className="mt-1 p-2 border w-full rounded"
                    placeholder="팀에 대한 설명을 입력하세요."
                />
            </div>

            {/* 팀 지역 입력 */}
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                지역
            </label>
            <select
                className="text-gray-500 text-sm ml-2"
                onChange={(e) => handleAreaChange(e.target.value)}
                value={selectedArea}
            >
                <option value="" disabled>광역자치단체</option>
                {Object.keys(areas).map(area => (
                    <option key={area} value={area}>{area}</option>
                ))}
            </select>
            {selectedArea && (
                    <select
                        className="text-gray-500 text-sm ml-2"
                        onChange={(e) => handleSubAreaChange(e.target.value)}
                        value={selectedSubArea}
                    >
                        <option value="" disabled>기초자치단체</option>
                        {areas[selectedArea].map(subArea => (
                            <option key={subArea} value={subArea}>{subArea}</option>
                        ))}
                    </select>
            )}


            {/* 제출 버튼 */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600"
                >
                    등록
                </button>
            </div>
        </form>
    );
}

export default TeamCreateClient;