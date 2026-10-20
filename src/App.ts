/* Programming 7
 * CSCI 4611, Fall 2026, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'

export class App extends gfx.GfxApp
{
    private cylinder: gfx.Mesh3;
    private cameraControls: gfx.OrbitControls;

    // --- Create the App class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

        this.cameraControls = new gfx.OrbitControls(this.camera);
        this.cylinder = new gfx.Mesh3();
    }


    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        // Setup the camera projection matrix and position.
        this.camera.setPerspectiveCamera(60, 1920/1080, 0.1, 10);

        // Set the camera position and orientation using orbit controls.
        this.cameraControls.setDistance(3);
        this.cameraControls.setOrbit(gfx.MathUtils.degreesToRadians(-22.5), 0);

        const ambientLight = new gfx.AmbientLight();
        ambientLight.ambientIntensity.set(0.25, 0.25, 0.25);

        const directionalLight = new gfx.DirectionalLight();
        directionalLight.diffuseIntensity.set(0.5, 0.5, 0.5);
        directionalLight.position.set(0, 1, 1);

        // Create a set of axes to visualize the world coordinate system.
        const axes = gfx.Geometry3Factory.createAxes();
        this.scene.add(axes);

        const cylinderMaterial = new gfx.PhongMaterial();
        this.cylinder.material = cylinderMaterial;

        this.createCylinderMesh(this.cylinder, 16, 2);
        //this.cylinder.material = new gfx.WireframeMaterial();
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        this.scene.add(this.cylinder);
    }

    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
       this.cameraControls.update(deltaTime);
    }

    private createCylinderMesh(mesh: gfx.Mesh3, numSegments: number, height: number): void
    {
        const vertices: gfx.Vector3[] = [];
        const normals: gfx.Vector3[] = [];
        const indices: number[] = [];

        const angleIncrement = (Math.PI * 2) / numSegments;

        for(let i = 0; i <= numSegments; i++)
        {
            const angle = i * angleIncrement;

            const topVertex = new gfx.Vector3(
                Math.cos(angle),
                height / 2,
                Math.sin(angle)
            );

            const bottomVertex = new gfx.Vector3(
                Math.cos(angle),
                -height / 2,
                Math.sin(angle)
            );

            vertices.push(topVertex);
            vertices.push(bottomVertex);

            const topNormal = new gfx.Vector3(
                Math.cos(angle),
                0,
                Math.sin(angle)
            );

            const bottomNormal = new gfx.Vector3(
                Math.cos(angle),
                0,
                Math.sin(angle)
            );

            normals.push(topNormal);
            normals.push(bottomNormal);
        }

        for(let i = 0; i < numSegments; i++)
        {
            indices.push(i*2+1, i*2, i*2+2);
            indices.push(i*2+1, i*2+2, i*2+3);
        }

        // Create the top disc with upward-facing normals.
        const topCenter = vertices.length;
        vertices.push(new gfx.Vector3(0, height/2, 0));
        normals.push(new gfx.Vector3(0, 1, 0));

        const topStart = vertices.length;
        for(let i=0; i <= numSegments; i++)
        {
            const angle = i * angleIncrement;

            vertices.push(new gfx.Vector3(
                Math.cos(angle),
                height/2, 
                Math.sin(angle)
            ));

            normals.push(new gfx.Vector3(0, 1, 0));
        }

        for(let i=0; i < numSegments; i++)
        {
            indices.push(topCenter, topStart+i+1, topStart+i);
        }

         // Create the bottom disc with upward-facing normals.
        const bottomCenter = vertices.length;
        vertices.push(new gfx.Vector3(0, -height/2, 0));
        normals.push(new gfx.Vector3(0, -1, 0));

        const bottomStart = vertices.length;
        for(let i=0; i <= numSegments; i++)
        {
            const angle = i * angleIncrement;

            vertices.push(new gfx.Vector3(
                Math.cos(angle),
                -height/2, 
                Math.sin(angle)
            ));

            normals.push(new gfx.Vector3(0, -1, 0));
        }

        for(let i=0; i < numSegments; i++)
        {
            indices.push(bottomCenter, bottomStart+i, bottomStart+i+1);
        }

        mesh.setVertices(vertices);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
    }
}``