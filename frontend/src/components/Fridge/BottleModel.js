import React, {useEffect} from 'react';
import { useGLTF } from '@react-three/drei';
import BOTTLE_URL from 'assets/bottle.glb';
import CAN_URL from 'assets/can.glb';
import GIN_URL from 'assets/gin.glb';
import RUM_URL from 'assets/rum.glb';
import VODKA_URL from 'assets/vodka.glb';
import WHISKEY_URL from 'assets/whiskey.glb';
import TEQUILA_URL from 'assets/tequila.glb';
import BRANDY_URL from 'assets/brandy.glb';
import LIQUEUR_URL from 'assets/liqueur.glb';

const BottleModel = ({ models, onBottleClick }) => {
    const { scene: bottleScene } = useGLTF(BOTTLE_URL);
    const { scene: canScene } = useGLTF(CAN_URL);
    const { scene: ginScene } = useGLTF(GIN_URL);
    const { scene: rumScene } = useGLTF(RUM_URL);
    const { scene: vodkaScene } = useGLTF(VODKA_URL);
    const { scene: whiskeyScene } = useGLTF(WHISKEY_URL);
    const { scene: tequilaScene } = useGLTF(TEQUILA_URL);
    const { scene: brandyScene } = useGLTF(BRANDY_URL);
    const { scene: liqueurScene } = useGLTF(LIQUEUR_URL);

    const getBottle = (drink) => {
        if (!drink) return bottleScene.clone();
        switch(drink.category) {
            case 1:
                return ginScene.clone();
            case 2:
                return rumScene.clone();
            case 3:
                return vodkaScene.clone();
            case 4:
                return whiskeyScene.clone();
            case 5:
                return tequilaScene.clone();
            case 6:
                return brandyScene.clone();
            case 7:
                return liqueurScene.clone();
            case 8:
                return canScene.clone();
            case 9:
                return bottleScene.clone();
            default:
                return bottleScene.clone();
        }
    }

    return (
        <>
            {models.map((model, index) => {
                // 모델의 행(row)과 열(column) 계산
                const row = Math.floor(index / 4); // 인덱스를 4로 나눈 몫
                const column = index % 4; // 인덱스를 4로 나눈 나머지

                // 모델의 위치 계산 (예시 값, 필요에 따라 조정)
                const position = [column * 0.45 - 0.7, row * -0.86 + 1.3, -0.6]; // X, Y, Z 위치
                let scale = [0.1, 0.1, 0.1]; // X, Y, Z 크기

                switch(model.category) {
                    case 1:
                        scale = [0.15, 0.15, 0.15];
                        position[1] += 0.09;
                        break;
                    case 2:
                        position[1] += 0.075;
                        break;
                    case 3:
                        scale = [0.17, 0.17, 0.17];
                        position[1] += 0.125;
                        break;
                    case 4:
                        scale = [0.15, 0.15, 0.15];
                        position[1] += 0.07;
                        break;
                    case 5:
                        scale = [0.1, 0.1, 0.1];
                        break;
                    case 6:
                        scale = [0.14, 0.14, 0.14];
                        position[1] += 0.04;
                        break;
                    case 7:
                        scale = [0.17, 0.17, 0.17];
                        position[1] += 0.09;
                        break;
                    case 8:
                        position[1] -= 0.09;
                        break;
                    case 9:
                        break;
                    default:
                        break;
                }

                return (
                    <primitive key={index} object={getBottle(model)} position={position} scale={scale} onClick={() => onBottleClick(index)}
                               onPointerOver={() => (document.body.style.cursor = 'pointer')}
                               onPointerOut={() => (document.body.style.cursor = 'auto')}
                    />
                );
            })}
        </>
    );
}

export default BottleModel;