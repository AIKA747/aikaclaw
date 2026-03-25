import Foundation
import Testing
@testable import AikaClaw

@Suite(.serialized) struct NodeServiceManagerTests {
    @Test func `builds node service commands with current CLI shape`() throws {
        let tmp = try makeTempDirForTests()
        CommandResolver.setProjectRoot(tmp.path)

        let aikaclawPath = tmp.appendingPathComponent("node_modules/.bin/aikaclaw")
        try makeExecutableForTests(at: aikaclawPath)

        let start = NodeServiceManager._testServiceCommand(["start"])
        #expect(start == [aikaclawPath.path, "node", "start", "--json"])

        let stop = NodeServiceManager._testServiceCommand(["stop"])
        #expect(stop == [aikaclawPath.path, "node", "stop", "--json"])
    }
}
