import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { rankList } from '../../interfaces';
import { changeGradeEmoji } from '../../libs/changeGradeEmoji';
import { client } from '../../libs/client';

export const HallOfFame = () => {
  const [ranks, setRanks] = useState<rankList[] | null>(null);
  const [errorAvatarId, setIsErrorAvatarId] = useState<(number | undefined)[]>(
    [],
  );
  const getRanks = async () => {
    const res = await client.get('/api/users/ranks?page=1&size=8');
    setRanks(res.data.data);
  };
  useEffect(() => {
    getRanks();
  }, []);
  return (
    <>
      <div>
        <span className="text-2xl font-bold">🏆 명예의 전당</span>
      </div>
      <div>
        {ranks &&
          ranks.map((rank) => (
            <div
              className="w-[350px] h-[60px] flex gap-[10px] items-center border-b mt-4"
              key={rank.userId}
            >
              <div className="w-[14px]">
                <span className="text-lg font-bold">{rank.rank}</span>
              </div>
              <div className="w-[326px] flex gap-2">
                <Link href={`/dashboard/${rank.userId}`}>
                  <div className="w-[45px] h-[45px] rounded-full overflow-hidden hover:cursor-pointer">
                    {errorAvatarId.includes(rank.avatar?.avatarId) ? (
                      <Image src="/favicon.ico" width="45px" height="45px" />
                    ) : (
                      <Image
                        src={
                          rank.avatar ? rank.avatar.remotePath : '/favicon.ico'
                        }
                        width="45px"
                        height="45px"
                        onError={() =>
                          setIsErrorAvatarId((prev) => [
                            ...prev,
                            rank.avatar?.avatarId,
                          ])
                        }
                      />
                    )}
                  </div>
                </Link>
                <div>
                  <div>
                    <Link href={`/dashboard/${rank.userId}`}>
                      <span className="text-[15px] font-bold hover:cursor-pointer">
                        {rank.nickname}
                      </span>
                    </Link>
                  </div>
                  <div className="flex justify-between w-[273px]">
                    <div>
                      <span className="text-sm">
                        {rank.infoMessage
                          ? `${rank.infoMessage.slice(0, 18)}...`
                          : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs mr-2">
                        {changeGradeEmoji(rank.grade ?? '')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
