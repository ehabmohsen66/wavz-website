import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const DotGlobeHero = React.forwardRef(({
  rotationSpeed = 0.005,
  globeRadius = 1.3,
  className,
  children,
  ...props
}, ref) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    
    // Width and height of the container
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create a sphere with wireframe material using WAVZ Brand blue color
    const geometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    // Create a premium, glowing wireframe mesh material
    const material = new THREE.MeshBasicMaterial({
      color: 0x1173BD, // WAVZ Brand Blue
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Ambient light source
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Point light source
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Animation frame hook
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Gentle, complex rotating motion
      sphere.rotation.y += rotationSpeed;
      sphere.rotation.x += rotationSpeed * 0.3;
      sphere.rotation.z += rotationSpeed * 0.15;
      
      renderer.render(scene, camera);
    };
    animate();

    // Responsive resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [rotationSpeed, globeRadius]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full h-screen bg-[#061E31] overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        {children}
      </div>
      
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 pointer-events-none w-full h-full" 
      />
    </div>
  );
});

DotGlobeHero.displayName = "DotGlobeHero";

export { DotGlobeHero };
