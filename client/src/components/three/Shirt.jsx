import React from 'react'
import { easing } from 'maath'
import { Decal, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const Shirt = ({ textureUrl }) => {
    const { nodes, materials } = useGLTF('/shirt_baked.glb')
    const logoTexture = useTexture(textureUrl)

    // Optionally, you can set a default color or prop for color
    useFrame((state, delta) => 
        easing.dampC(materials.lambert1.color, [1, 1, 1], 0.25, delta)
    )

    // Key for rerendering if texture changes
    const stateString = JSON.stringify({ textureUrl })

    return (
        <group key={stateString}>
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