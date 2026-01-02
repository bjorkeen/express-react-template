import numpy as np

# 1. Service Definition (Service Graph Nodes)
# Scale: 1 (Low) to 10 (High)
services = {
    'Frontend (React)':    [2, 2],
    'Backend (NodeJS)':    [6, 4],
    'Database (MongoDB)':  [4, 8]
}

# 2. Available Servers Definition (Simulated Infrastructure)
servers = {
    'Server_A (General)':  {'cpu': 8,  'ram': 8},   # Balanced
    'Server_B (Compute)':  {'cpu': 12, 'ram': 4},   # High CPU
    'Server_C (Memory)':   {'cpu': 4,  'ram': 16}   # High RAM
}

def cosine_similarity(vec_a, vec_b):
    """
    Calculates Cosine Similarity between resource vectors.
    Formula: (A . B) / (||A|| * ||B||)
    """
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0 or norm_b == 0:
        return 0
    return dot_product / (norm_a * norm_b)

def place_services(services, servers):
    placement_results = {}
    
    print("-" * 60)
    print("Step 0: Service Sorting (Heuristic Optimization)")
    # Sort services by total demand (Descending) - Best Fit Decreasing Strategy
    sorted_services = dict(sorted(services.items(), key=lambda item: sum(item[1]), reverse=True))
    
    print(f"Placement Order: {list(sorted_services.keys())}")
    print("-" * 60)
    print("Starting Placement Mechanism (Cosine Similarity)")
    print("-" * 60)

    for service_name, reqs in sorted_services.items():
        req_cpu, req_ram = reqs
        req_vector = np.array([req_cpu, req_ram])
        
        best_server = None
        max_score = -1
        
        print(f"\n[Service: {service_name}] Requirements: CPU={req_cpu}, RAM={req_ram}")
        
        for server_name, specs in servers.items():
            avail_cpu = specs['cpu']
            avail_ram = specs['ram']
            
            # Check if resources are sufficient (Constraint)
            if avail_cpu >= req_cpu and avail_ram >= req_ram:
                avail_vector = np.array([avail_cpu, avail_ram])
                
                # Calculate Score
                score = cosine_similarity(req_vector, avail_vector)
                
                print(f"  -> Checking {server_name}: Available [C:{avail_cpu}, R:{avail_ram}] -> Score: {score:.4f}")
                
                if score > max_score:
                    max_score = score
                    best_server = server_name
            else:
                print(f"  -> {server_name}: Insufficient resources (Skip).")

        # Assign and Update Resources
        if best_server:
            print(f"  ✅ SELECTED: {best_server} (Score: {max_score:.4f})")
            placement_results[service_name] = best_server
            
            # Update server state
            servers[best_server]['cpu'] -= req_cpu
            servers[best_server]['ram'] -= req_ram
        else:
            print(f"  ❌ FAILED: No suitable server found!")
            placement_results[service_name] = "None"

    return placement_results

# Execute
if __name__ == "__main__":
    place_services(services, servers)