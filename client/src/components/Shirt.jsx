import React from 'react'
import { easing } from 'maath'
import { Decal, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const Shirt = ({ textureUrl }) => {
    const { nodes, materials } = useGLTF('/shirt_baked.glb')
    const logoTexture = useTexture('/logo.png')

    // Smooth color update
    useFrame((state, delta) => {
        easing.dampC(materials.lambert1.color, [1, 1, 1], 0.25, delta)
    })

    const stateString = JSON.stringify({ textureUrl })

    return (
        <group key={stateString} scale={[3, 3, 3]}>
            <mesh
                castShadow
                geometry={nodes.T_Shirt_male.geometry}
                material={materials.lambert1}
                dispose={null}
            >
                <Decal
                    position={[0, 0.04, 0.15]}
                    rotation={[0, 0, 0]}
                    scale={0.15}
                    map={logoTexture}
                    mapAnisotropy={16}
                    depthTest={false}
                    depthWrite={true}
                />
            </mesh>
        </group>
    )
}

export default Shirt